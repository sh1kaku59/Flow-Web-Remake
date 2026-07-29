from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.modules.meeting_processing.models import ProcessingJob, ProcessingStep, Meeting, AudioFile
from app.modules.meeting_intelligence.models import TranscriptSegment, MeetingSummary
from datetime import datetime, timezone
import logging
import os

from worker.pipelines.audio_processor import preprocess_audio
from worker.pipelines.diarization_service import diarize_audio
from worker.pipelines.transcription_service import transcribe_audio
from worker.pipelines.semantic_service import generate_summary, generate_embedding

logger = logging.getLogger(__name__)

# Removed celery for local MVP without Redis
def process_meeting(job_id: str):
    db: Session = SessionLocal()
    try:
        job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
        if not job:
            logger.error(f"Job {job_id} not found.")
            return
            
        meeting = db.query(Meeting).filter(Meeting.id == job.meeting_id).first()
        audio_file = db.query(AudioFile).filter(AudioFile.meeting_id == meeting.id).first()
        
        if not audio_file:
            logger.error(f"Audio file not found for meeting {meeting.id}")
            raise FileNotFoundError("Audio file is missing.")

        from app.infrastructure.object_storage.supabase_adapter import storage_adapter
        bucket_name = "meetings"
        # Create a dedicated temp directory for this job
        temp_dir = os.path.join(os.getcwd(), "temp")
        os.makedirs(temp_dir, exist_ok=True)
        
        raw_audio_path = os.path.join(temp_dir, f"raw_{meeting.id}.tmp")
        processed_audio_path = os.path.join(temp_dir, f"processed_{meeting.id}.wav")
        
        try:
            logger.info(f"Downloading {audio_file.file_url} from bucket {bucket_name}")
            file_bytes = storage_adapter.download_file(bucket_name, audio_file.file_url)
            with open(raw_audio_path, "wb") as f:
                f.write(file_bytes)
        except Exception as e:
            logger.error(f"Failed to download audio file: {e}")
            raise

        job.status = "Processing"
        job.started_at = datetime.now(timezone.utc)
        meeting.status = "Processing"
        db.commit()
        
        steps = [
            "Audio Preprocessing",
            "Speaker Diarization",
            "Speech-to-Text (STT)",
            "Timestamp Alignment",
            "Semantic Analysis"
        ]
        
        # Tạo sẵn các bước
        db_steps = []
        for i, step_name in enumerate(steps):
            step = ProcessingStep(
                job_id=job.id,
                step_name=step_name,
                step_order=i+1,
                status="Pending"
            )
            db.add(step)
            db_steps.append(step)
        db.commit()

        # Step 1: Preprocessing
        db_steps[0].status = "Processing"
        db_steps[0].started_at = datetime.now(timezone.utc)
        db.commit()
        
        preprocess_audio(raw_audio_path, processed_audio_path)
        
        db_steps[0].status = "Completed"
        db_steps[0].completed_at = datetime.now(timezone.utc)
        job.progress_percent = 20
        db.commit()

        # Step 2: Diarization
        db_steps[1].status = "Processing"
        db_steps[1].started_at = datetime.now(timezone.utc)
        db.commit()
        
        diarization_results = diarize_audio(processed_audio_path)
        
        db_steps[1].status = "Completed"
        db_steps[1].completed_at = datetime.now(timezone.utc)
        job.progress_percent = 40
        db.commit()

        # Step 3: Transcription
        db_steps[2].status = "Processing"
        db_steps[2].started_at = datetime.now(timezone.utc)
        db.commit()
        
        transcription_results = transcribe_audio(processed_audio_path)
        
        db_steps[2].status = "Completed"
        db_steps[2].completed_at = datetime.now(timezone.utc)
        job.progress_percent = 60
        db.commit()

        # Step 4: Timestamp Alignment & Speaker Identification
        db_steps[3].status = "Processing"
        db_steps[3].started_at = datetime.now(timezone.utc)
        db.commit()
        
        # Load workspace voice samples
        from app.modules.meeting_intelligence.models import VoiceSample, SpeakerStatistic, SemanticSegment, SearchIndex, MeetingSummary
        from app.modules.meeting_processing.models import Speaker
        from worker.pipelines.voice_service import extract_voice_embedding, compare_embeddings
        import soundfile as sf
        import librosa
        
        workspace_samples = db.query(VoiceSample).filter(
            VoiceSample.workspace_id == meeting.workspace_id,
            VoiceSample.embedding_vector.isnot(None)
        ).all()
        
        unique_speakers = list(set([d["speaker"] for d in diarization_results]))
        speaker_mapping = {}
        
        try:
            audio_data, sr = librosa.load(processed_audio_path, sr=16000)
            for spk in unique_speakers:
                spk_segments = [d for d in diarization_results if d["speaker"] == spk]
                longest_seg = max(spk_segments, key=lambda x: x["end"] - x["start"])
                
                # Minimum 1 second for embedding
                if longest_seg["end"] - longest_seg["start"] < 1.0:
                    best_match = spk
                else:
                    start_sample = int(longest_seg["start"] * sr)
                    end_sample = int(longest_seg["end"] * sr)
                    cropped = audio_data[start_sample:end_sample]
                    
                    tmp_spk_path = os.path.join(temp_dir, f"tmp_spk_{spk}_{meeting.id}.wav")
                    sf.write(tmp_spk_path, cropped, sr)
                    spk_emb = extract_voice_embedding(tmp_spk_path)
                    
                    if os.path.exists(tmp_spk_path):
                        os.remove(tmp_spk_path)
                        
                    best_match = spk
                    best_score = 0.5 # Cosine similarity threshold
                    
                    for vs in workspace_samples:
                        if not vs.embedding_vector: continue
                        score = compare_embeddings(spk_emb, vs.embedding_vector)
                        if score > best_score:
                            best_score = score
                            best_match = vs.speaker_label
                            
                # Create Speaker record in DB
                db_speaker = Speaker(
                    meeting_id=meeting.id,
                    speaker_label=best_match
                )
                db.add(db_speaker)
                db.commit()
                db.refresh(db_speaker)
                speaker_mapping[spk] = db_speaker.id
                
        except Exception as e:
            logger.error(f"Failed to identify speakers: {e}")
            for spk in unique_speakers:
                db_speaker = Speaker(
                    meeting_id=meeting.id,
                    speaker_label=spk
                )
                db.add(db_speaker)
                db.commit()
                db.refresh(db_speaker)
                speaker_mapping[spk] = db_speaker.id

        # Simple alignment: assign speaker based on midpoint of transcript segment
        aligned_segments = []
        full_text_for_summary = ""
        
        # For Speaker Statistics
        speaker_times = {spk_id: 0.0 for spk_id in speaker_mapping.values()}
        speaker_speeches = {spk_id: 0 for spk_id in speaker_mapping.values()}
        
        for t_seg in transcription_results:
            mid_point = (t_seg["start"] + t_seg["end"]) / 2
            
            # Find matching speaker
            assigned_speaker_id = None
            for d_seg in diarization_results:
                if d_seg["start"] <= mid_point <= d_seg["end"]:
                    assigned_speaker_id = speaker_mapping.get(d_seg["speaker"])
                    break
                    
            if not assigned_speaker_id and len(speaker_mapping) > 0:
                assigned_speaker_id = list(speaker_mapping.values())[0]
            
            seg_duration = t_seg["end"] - t_seg["start"]
            if assigned_speaker_id:
                speaker_times[assigned_speaker_id] += seg_duration
                speaker_speeches[assigned_speaker_id] += 1
            
            aligned_segments.append({
                "start": t_seg["start"],
                "end": t_seg["end"],
                "text": t_seg["text"],
                "speaker_id": assigned_speaker_id
            })
            
            # Fetch speaker label for summary
            spk_label = db.query(Speaker).filter(Speaker.id == assigned_speaker_id).first().speaker_label if assigned_speaker_id else "Unknown"
            full_text_for_summary += f"{spk_label}: {t_seg['text']}\n"
            
        # Save Speaker Statistics
        for spk_id, total_time in speaker_times.items():
            db.add(SpeakerStatistic(
                meeting_id=meeting.id,
                speaker_id=spk_id,
                total_speaking_time=total_time,
                number_of_speeches=speaker_speeches[spk_id],
                lively_discussion=0.0 # Mock metric
            ))
            
        db_steps[3].status = "Completed"
        db_steps[3].completed_at = datetime.now(timezone.utc)
        job.progress_percent = 80
        db.commit()

        # Step 5: Semantic Analysis (Summary + Embeddings)
        db_steps[4].status = "Processing"
        db_steps[4].started_at = datetime.now(timezone.utc)
        db.commit()
        
        # Prepare segments for batched summary & topic generation
        topic_input_segments = []
        for seg in aligned_segments:
            spk_label = db.query(Speaker).filter(Speaker.id == seg["speaker_id"]).first().speaker_label if seg["speaker_id"] else "Unknown"
            topic_input_segments.append({
                "start": seg["start"],
                "end": seg["end"],
                "text": seg["text"],
                "speaker_label": spk_label
            })
            
        # Single Batched Gemini Call (50% Request Reduction)
        from worker.pipelines.semantic_service import generate_summary_and_topics_batched
        summary_text, topics = generate_summary_and_topics_batched(topic_input_segments)

        db.add(MeetingSummary(meeting_id=meeting.id, content=summary_text))
        
        # Save topics to DB and determine the main meeting topic
        topic_counts = {}
        for t in topics:
            db.add(SemanticSegment(
                meeting_id=meeting.id,
                topic_label=t.get("topic_label", "General Discussion"),
                start_time=t.get("start_time", 0.0),
                end_time=t.get("end_time", 0.0),
                summary_content=t.get("summary_content", "")
            ))
            label = t.get("topic_label", "General Discussion")
            duration = t.get("end_time", 0.0) - t.get("start_time", 0.0)
            topic_counts[label] = topic_counts.get(label, 0) + duration
            
        if topic_counts:
            main_topic = max(topic_counts.items(), key=lambda x: x[1])[0]
            meeting.topic = main_topic
        db.commit()
        
        # Save Segments with Embeddings & Search Index
        for seg in aligned_segments:
            vector = generate_embedding(seg["text"])
            valid_vector = vector if (vector and len(vector) > 0) else None
            
            db_segment = TranscriptSegment(
                meeting_id=meeting.id,
                speaker_id=seg["speaker_id"],
                start_time=seg["start"],
                end_time=seg["end"],
                content=seg["text"],
                embedding=valid_vector
            )
            db.add(db_segment)
            db.commit()
            db.refresh(db_segment)
            
            # Also add to Search Index
            search_idx = SearchIndex(
                meeting_id=meeting.id,
                segment_id=db_segment.id,
                workspace_id=meeting.workspace_id,
                embedding=valid_vector,
                content_text=seg["text"]
            )
            db.add(search_idx)
            
        db_steps[4].status = "Completed"
        db_steps[4].completed_at = datetime.now(timezone.utc)
        job.progress_percent = 100
        
        job.status = "Completed"
        job.completed_at = datetime.now(timezone.utc)
        meeting.status = "Completed"
        db.commit()
            
        # Clean up voice samples for security (Requirement 1)
        voice_samples_to_delete = db.query(VoiceSample).filter(VoiceSample.workspace_id == meeting.workspace_id).all()
        for vs in voice_samples_to_delete:
            try:
                if vs.file_url:
                    storage_adapter.delete_file("meetings", vs.file_url)
            except Exception as e:
                logger.warning(f"Note during voice sample storage deletion: {e}")
            db.delete(vs)
        db.commit()
            
        logger.info(f"Successfully processed meeting {meeting.id} and cleared voice samples.")
        
    except Exception as e:
        logger.error(f"Error processing job {job_id}: {e}")
        db.rollback()
        if 'job' in locals() and job:
            job.status = "Failed"
            job.progress_percent = 0
            if 'meeting' in locals() and meeting:
                meeting.status = "Failed"
            db.commit()
        return
    finally:
        # Guarantee cleanup of all temp files
        try:
            if 'processed_audio_path' in locals() and os.path.exists(processed_audio_path):
                os.remove(processed_audio_path)
            if 'raw_audio_path' in locals() and os.path.exists(raw_audio_path):
                os.remove(raw_audio_path)
        except Exception as e:
            logger.error(f"Failed to clean up temp files: {e}")
        db.close()
