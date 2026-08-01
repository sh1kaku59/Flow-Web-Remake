from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.infrastructure.database.session import get_db
from app.infrastructure.object_storage.supabase_adapter import storage_adapter
from app.shared_kernel.policies.workspace_context import get_workspace_context
from app.modules.anonymous_workspace.models import AnonymousWorkspace
from .models import Meeting, AudioFile, ProcessingJob
from datetime import datetime, timezone, timedelta
import uuid

router = APIRouter(prefix="/audio", tags=["Audio Upload"])

from fastapi.responses import FileResponse
import os

@router.get("/stream/{file_path:path}")
def stream_local_audio(file_path: str):
    full_path = os.path.join("temp", "uploads", file_path)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Audio file not found on local storage")
    return FileResponse(full_path)

@router.post("/upload")
async def upload_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    # 1. Validate file format and size
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be audio.")
        
    file_bytes = await file.read()
    if len(file_bytes) > 500 * 1024 * 1024: # 500MB max limit
        raise HTTPException(status_code=413, detail="Dung lượng tệp âm thanh tải lên quá 500MB.")
        
    # 2. Create Meeting in DB
    meeting = Meeting(
        workspace_id=workspace.id,
        title=file.filename or "New Meeting",
        status="Pending",
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # 3. Upload to Object Storage
    import os
    _, ext = os.path.splitext(file.filename)
    safe_filename = f"audio{ext}"
    file_path = f"{workspace.id}/{meeting.id}/{safe_filename}"
    try:
        storage_adapter.upload_file("meetings", file_path, file_bytes, file.content_type)
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.delete(meeting)
        db.commit()
        error_str = str(e)
        if "413" in error_str or "Payload too large" in error_str or "exceeded the maximum allowed size" in error_str:
            raise HTTPException(
                status_code=413,
                detail="Dung lượng tệp âm thanh tải lên quá 50MB."
            )
        raise HTTPException(status_code=500, detail=f"Failed to upload to storage: {error_str}")
        
    # 4. Save AudioFile record
    audio_file = AudioFile(
        meeting_id=meeting.id,
        file_url=file_path,
        duration=0, # To be determined by AI worker
        file_size=len(file_bytes),
        format=file.content_type
    )
    db.add(audio_file)
    
    # 5. Create ProcessingJob
    job = ProcessingJob(
        meeting_id=meeting.id,
        status="Pending",
        job_type="FullPipeline"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # 6. Dispatch Background Job here!
    from worker.tasks import process_meeting
    background_tasks.add_task(process_meeting, str(job.id))
    
    return {
        "meeting_id": str(meeting.id),
        "job_id": str(job.id),
        "status": job.status
    }

from .models import ProcessingStep
from app.modules.meeting_intelligence.models import MeetingSummary, TranscriptSegment

@router.get("/jobs/{job_id}")
def get_job_status(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    meeting = db.query(Meeting).filter(Meeting.id == job.meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    steps = db.query(ProcessingStep).filter(ProcessingStep.job_id == job_id).order_by(ProcessingStep.step_order).all()
    
    return {
        "job_id": job.id,
        "meeting_id": meeting.id,
        "status": job.status,
        "progress_percent": job.progress_percent,
        "steps": [{"name": s.step_name, "status": s.status} for s in steps]
    }

ai_router = APIRouter(prefix="/ai", tags=["AI Integration"])

from pydantic import BaseModel
class AIProgressRequest(BaseModel):
    job_id: uuid.UUID
    step_name: str
    status: str
    progress_percent: float

@ai_router.post("/progress")
def update_ai_progress(
    request: AIProgressRequest,
    db: Session = Depends(get_db)
):
    job = db.query(ProcessingJob).filter(ProcessingJob.id == request.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job.status = request.status
    job.progress_percent = request.progress_percent
    
    step = db.query(ProcessingStep).filter(ProcessingStep.job_id == job.id, ProcessingStep.step_name == request.step_name).first()
    if not step:
        step = ProcessingStep(
            job_id=job.id,
            step_name=request.step_name,
            step_order=db.query(ProcessingStep).filter(ProcessingStep.job_id == job.id).count() + 1,
            status=request.status
        )
        db.add(step)
    else:
        step.status = request.status
        
    db.commit()
    return {"status": "success"}

@router.get("/{audio_id}/status")
def get_audio_processing_status(
    audio_id: uuid.UUID,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    audio = db.query(AudioFile).filter(AudioFile.id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")
        
    meeting = db.query(Meeting).filter(Meeting.id == audio.meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    job = db.query(ProcessingJob).filter(ProcessingJob.meeting_id == meeting.id).order_by(ProcessingJob.created_at.desc()).first()
    if not job:
        raise HTTPException(status_code=404, detail="Processing job not found")
        
    steps = db.query(ProcessingStep).filter(ProcessingStep.job_id == job.id).order_by(ProcessingStep.step_order).all()
    
    return {
        "job_id": job.id,
        "meeting_id": meeting.id,
        "status": job.status,
        "progress_percent": job.progress_percent,
        "steps": [{"name": s.step_name, "status": s.status} for s in steps]
    }

from fastapi.responses import StreamingResponse
import asyncio

@router.get("/{audio_id}/stream")
async def stream_audio_processing_status(
    audio_id: uuid.UUID,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    # Validates workspace access
    audio = db.query(AudioFile).filter(AudioFile.id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")
    meeting = db.query(Meeting).filter(Meeting.id == audio.meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=403, detail="Not authorized")
    job = db.query(ProcessingJob).filter(ProcessingJob.meeting_id == meeting.id).order_by(ProcessingJob.created_at.desc()).first()
    if not job:
        raise HTTPException(status_code=404, detail="Processing job not found")

    async def event_generator():
        # Lắng nghe thay đổi trạng thái (giả lập polling database, thực tế nên dùng Redis/PubSub)
        last_progress = -1
        while True:
            # Re-fetch job state
            db.refresh(job)
            if job.progress_percent != last_progress:
                yield f"data: {{\"status\": \"{job.status}\", \"progress_percent\": {job.progress_percent}}}\n\n"
                last_progress = job.progress_percent
                
            if job.status in ["Completed", "Failed"]:
                break
            await asyncio.sleep(2)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")
meetings_router = APIRouter(prefix="/meetings", tags=["Meetings"])

@meetings_router.get("")
def list_meetings(
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    from sqlalchemy.orm import aliased
    from sqlalchemy.sql import func
    from app.modules.meeting_intelligence.models import TranscriptSegment
    
    audio_alias = aliased(AudioFile)
    
    meetings = db.query(Meeting).filter(Meeting.workspace_id == workspace.id).order_by(Meeting.created_at.desc()).all()
    
    result = []
    for m in meetings:
        audio = db.query(AudioFile).filter(AudioFile.meeting_id == m.id).first()
        duration = float(audio.duration) if audio and audio.duration else 0.0
        
        if duration == 0.0:
            max_end = db.query(func.max(TranscriptSegment.end_time)).filter(TranscriptSegment.meeting_id == m.id).scalar()
            if max_end:
                duration = float(max_end)
                
        result.append({
            "id": m.id, 
            "title": m.title, 
            "topic": m.topic, 
            "status": m.status, 
            "created_at": m.created_at,
            "duration": duration
        })
        
    return result

from app.modules.meeting_intelligence.models import SemanticSegment

@meetings_router.get("/{meeting_id}")
def get_meeting_details(
    meeting_id: uuid.UUID,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    audio = db.query(AudioFile).filter(AudioFile.meeting_id == meeting_id).first()
    summary = db.query(MeetingSummary).filter(MeetingSummary.meeting_id == meeting_id).first()
    segments = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting_id).order_by(TranscriptSegment.start_time).all()
    topics = db.query(SemanticSegment).filter(SemanticSegment.meeting_id == meeting_id).order_by(SemanticSegment.start_time).all()
    
    from app.modules.meeting_processing.models import Speaker
    from app.modules.meeting_intelligence.models import SpeakerStatistic
    
    speakers = db.query(Speaker).filter(Speaker.meeting_id == meeting_id).all()
    speaker_stats = db.query(SpeakerStatistic).filter(SpeakerStatistic.meeting_id == meeting_id).all()
    
    # Map stats by speaker_id
    stats_map = {stat.speaker_id: stat for stat in speaker_stats}
    
    # Lấy pre-signed URL thay vì bucket path
    audio_signed_url = None
    if audio and audio.file_url:
        audio_signed_url = storage_adapter.get_signed_url("meetings", audio.file_url)
    
    return {
        "id": meeting.id,
        "title": meeting.title,
        "topic": meeting.topic,
        "status": meeting.status,
        "created_at": meeting.created_at,
        "audio_url": audio_signed_url,
        "summary": summary.content if summary else None,
        "speakers": [
            {
                "id": s.id,
                "name": s.speaker_label,
                "total_speaking_time": stats_map.get(s.id).total_speaking_time if stats_map.get(s.id) else 0.0,
                "number_of_speeches": stats_map.get(s.id).number_of_speeches if stats_map.get(s.id) else 0,
            }
            for s in speakers
        ],
        "topics": [{"label": t.topic_label, "start": t.start_time, "end": t.end_time, "summary": t.summary_content} for t in topics],
        "transcript": [{"speaker": s.speaker_id, "start": s.start_time, "end": s.end_time, "text": s.content} for s in segments]
    }

from pydantic import BaseModel

class RenameMeetingRequest(BaseModel):
    title: str

@meetings_router.patch("/{meeting_id}")
def rename_meeting(
    meeting_id: uuid.UUID,
    request: RenameMeetingRequest,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    meeting.title = request.title
    db.commit()
    db.refresh(meeting)
    return {"id": meeting.id, "title": meeting.title}
