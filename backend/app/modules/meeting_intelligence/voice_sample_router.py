from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.infrastructure.database.session import get_db
from app.infrastructure.object_storage.supabase_adapter import storage_adapter
from app.shared_kernel.policies.workspace_context import get_workspace_context
from app.modules.anonymous_workspace.models import AnonymousWorkspace
from .models import VoiceSample
from datetime import datetime, timezone
from typing import Optional
import uuid
import os

router = APIRouter(prefix="/voice-samples", tags=["Voice Samples"])

@router.get("/{sample_id}/audio")
def stream_voice_sample_audio(
    sample_id: uuid.UUID,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    sample = db.query(VoiceSample).filter(VoiceSample.id == sample_id, VoiceSample.workspace_id == workspace.id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Voice sample not found")
        
    try:
        signed_url = storage_adapter.get_signed_url("meetings", sample.file_url)
        return RedirectResponse(url=signed_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve audio stream")

def compute_and_save_embedding(db: Session, voice_sample_id: uuid.UUID, raw_audio_bytes: bytes):
    try:
        sample = db.query(VoiceSample).filter(VoiceSample.id == voice_sample_id).first()
        if not sample:
            return
            
        # Write bytes to temp file
        temp_raw_path = f"temp_raw_{voice_sample_id}.tmp"
        with open(temp_raw_path, "wb") as f:
            f.write(raw_audio_bytes)
            
        temp_wav_path = f"temp_sample_{voice_sample_id}.wav"
        
        # Convert to 16kHz Mono WAV using FFmpeg
        import subprocess
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run([
            ffmpeg_exe,
            "-i", temp_raw_path,
            "-ac", "1",
            "-ar", "16000",
            "-y",
            temp_wav_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
        from worker.pipelines.voice_service import extract_voice_embedding
        embedding = extract_voice_embedding(temp_wav_path)
        
        if os.path.exists(temp_raw_path):
            os.remove(temp_raw_path)
        if os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)
            
        sample.embedding_vector = embedding
        db.commit()
    except Exception as e:
        print(f"Error computing embedding: {e}")

@router.post("")
async def upload_voice_sample(
    background_tasks: BackgroundTasks,
    speaker_label: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    content_type = file.content_type or ""
    filename = file.filename or ""
    valid_exts = (".wav", ".mp3", ".m4a", ".mp4", ".aac", ".flac", ".ogg", ".webm", ".wma")
    if not (content_type.startswith("audio/") or content_type.startswith("video/") or filename.lower().endswith(valid_exts)):
        raise HTTPException(status_code=400, detail="Vui lòng tải lên tệp mẫu giọng nói hợp lệ (WAV, MP3, M4A...).")
        
    file_bytes = await file.read()
    if len(file_bytes) > 50 * 1024 * 1024: # 50MB max limit for voice samples
        raise HTTPException(status_code=400, detail="File too large")

    sample_id = uuid.uuid4()
    import os
    _, ext = os.path.splitext(file.filename)
    safe_filename = f"audio{ext}"
    file_path = f"{workspace.id}/voice_samples/{sample_id}/{safe_filename}"
    
    try:
        storage_adapter.upload_file("meetings", file_path, file_bytes, file.content_type)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to upload to storage: {str(e)}")
        
    sample = VoiceSample(
        id=sample_id,
        workspace_id=workspace.id,
        speaker_label=speaker_label,
        file_url=file_path,
        duration=0 # Calculate duration if possible
    )
    db.add(sample)
    db.commit()
    db.refresh(sample)
    
    # Run embedding extraction in background
    background_tasks.add_task(compute_and_save_embedding, db, sample.id, file_bytes)

    return {"id": sample.id, "speaker_label": sample.speaker_label, "file_url": file_path}

@router.get("")
def list_voice_samples(
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    samples = db.query(VoiceSample).filter(VoiceSample.workspace_id == workspace.id).order_by(VoiceSample.created_at.desc()).all()
    
    result = []
    for s in samples:
        signed_url = storage_adapter.get_signed_url("meetings", s.file_url) if s.file_url else None
        result.append({
            "id": s.id,
            "speaker_label": s.speaker_label,
            "file_url": signed_url,
            "created_at": s.created_at,
            "duration": s.duration,
            "has_embedding": s.embedding_vector is not None
        })
    return result

from pydantic import BaseModel

class VoiceSampleUpdate(BaseModel):
    speaker_label: str

@router.patch("/{sample_id}")
def update_voice_sample(
    sample_id: uuid.UUID,
    update_data: VoiceSampleUpdate,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    sample = db.query(VoiceSample).filter(VoiceSample.id == sample_id, VoiceSample.workspace_id == workspace.id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Voice sample not found")
        
    sample.speaker_label = update_data.speaker_label
    db.commit()
    return {"id": sample.id, "speaker_label": sample.speaker_label}

@router.delete("/{sample_id}")
def delete_voice_sample(
    sample_id: uuid.UUID,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    sample = db.query(VoiceSample).filter(VoiceSample.id == sample_id, VoiceSample.workspace_id == workspace.id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Voice sample not found")
        
    try:
        if sample.file_url:
            storage_adapter.delete_file("meetings", sample.file_url)
    except Exception as e:
        print(f"Failed to delete file from storage: {e}")
        
    db.delete(sample)
    db.commit()
    return {"message": "Deleted successfully"}
