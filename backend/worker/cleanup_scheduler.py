import asyncio
import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.modules.meeting_processing.models import Meeting, AudioFile, ProcessingJob, ProcessingStep, Speaker
from app.modules.meeting_intelligence.models import TranscriptSegment, SemanticSegment, SpeakerStatistic, SearchIndex, MeetingSummary
from app.infrastructure.object_storage.supabase_adapter import storage_adapter

logger = logging.getLogger(__name__)

async def cleanup_old_meetings_task():
    while True:
        try:
            logger.info("Running cleanup task for meetings older than 24 hours...")
            db: Session = SessionLocal()
            try:
                # Find meetings older than 24 hours
                cutoff_time = datetime.now(timezone.utc) - timedelta(hours=24)
                old_meetings = db.query(Meeting).filter(Meeting.created_at < cutoff_time).all()
                
                for meeting in old_meetings:
                    logger.info(f"Cleaning up meeting {meeting.id} (created at {meeting.created_at})")
                    
                    # 1. Delete AudioFile and storage
                    audio_file = db.query(AudioFile).filter(AudioFile.meeting_id == meeting.id).first()
                    if audio_file:
                        try:
                            storage_adapter.delete_file("meetings", audio_file.file_url)
                        except Exception as e:
                            logger.error(f"Failed to delete audio file {audio_file.file_url} from storage: {e}")
                        db.delete(audio_file)
                    
                    # 2. Delete related records
                    db.query(ProcessingStep).filter(ProcessingStep.job_id.in_(
                        db.query(ProcessingJob.id).filter(ProcessingJob.meeting_id == meeting.id)
                    )).delete(synchronize_session=False)
                    db.query(ProcessingJob).filter(ProcessingJob.meeting_id == meeting.id).delete()
                    
                    db.query(SearchIndex).filter(SearchIndex.meeting_id == meeting.id).delete()
                    db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting.id).delete()
                    db.query(SemanticSegment).filter(SemanticSegment.meeting_id == meeting.id).delete()
                    db.query(SpeakerStatistic).filter(SpeakerStatistic.meeting_id == meeting.id).delete()
                    db.query(MeetingSummary).filter(MeetingSummary.meeting_id == meeting.id).delete()
                    db.query(Speaker).filter(Speaker.meeting_id == meeting.id).delete()
                    
                    # 3. Delete Meeting
                    db.delete(meeting)
                    db.commit()
                    logger.info(f"Successfully deleted meeting {meeting.id}")
                    
            except Exception as e:
                logger.error(f"Error during cleanup task: {e}")
                db.rollback()
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Critical error in cleanup scheduler loop: {e}")
            
        # Sleep for 30 minutes before running again
        await asyncio.sleep(30 * 60)
