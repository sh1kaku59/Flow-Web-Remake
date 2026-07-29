from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database.session import get_db
from app.shared_kernel.policies.workspace_context import get_workspace_context
from app.modules.anonymous_workspace.models import AnonymousWorkspace
from app.modules.meeting_processing.models import Meeting, AudioFile
from .models import MeetingSummary, TranscriptSegment, SemanticSegment, SpeakerStatistic, VoiceSample
import uuid

router = APIRouter(tags=["Analytics"])

from pydantic import BaseModel
class SummaryRequest(BaseModel):
    force: bool = False

@router.post("/meetings/{meeting_id}/summary")
def generate_or_get_summary(
    meeting_id: uuid.UUID,
    request_body: SummaryRequest = None,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    if request_body is None:
        request_body = SummaryRequest()
        
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    summary = db.query(MeetingSummary).filter(MeetingSummary.meeting_id == meeting_id).first()
    
    if summary and not request_body.force:
        return {
            "meeting_id": str(meeting.id),
            "title": meeting.title,
            "summary": summary.content,
            "cached": True
        }
        
    if request_body.force and summary:
        # Reprocess semantics (delete old summary for regeneration)
        db.delete(summary)
        db.commit()
        summary = None
        
    if summary is None:
        # In reality, this triggers a background worker. We return pending for now.
        return {
            "meeting_id": str(meeting.id),
            "title": meeting.title,
            "summary": None,
            "cached": False,
            "status": "Pending"
        }

@router.get("/audio/{audio_id}")
def get_audio_analysis_and_transcript(
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
        
    segments = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting.id).order_by(TranscriptSegment.start_time).all()
    semantic_segments = db.query(SemanticSegment).filter(SemanticSegment.meeting_id == meeting.id).order_by(SemanticSegment.start_time).all()
    speaker_stats = db.query(SpeakerStatistic).filter(SpeakerStatistic.meeting_id == meeting.id).all()
    
    return {
        "meeting_id": meeting.id,
        "audio_id": audio.id,
        "transcript": [{"id": s.id, "speaker": s.speaker_id, "start": s.start_time, "end": s.end_time, "text": s.content} for s in segments],
        "topics": [{"id": s.id, "label": s.topic_label, "start": s.start_time, "end": s.end_time, "summary": s.summary_content} for s in semantic_segments],
        "speaker_statistics": [{"speaker_id": stat.speaker_id, "total_time": stat.total_speaking_time, "speeches": stat.number_of_speeches, "lively": stat.lively_discussion} for stat in speaker_stats]
    }

from fastapi import Form, File, UploadFile
from fastapi.responses import Response
from .services.report_generator import parse_custom_template, generate_report_content, build_pdf_report
import urllib.parse

@router.post("/meetings/{meeting_id}/export-report")
async def export_meeting_report(
    meeting_id: uuid.UUID,
    template_type: str = Form("default"),
    custom_template: UploadFile = File(None),
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    from app.modules.meeting_processing.models import Speaker

    segments = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting.id).order_by(TranscriptSegment.start_time).all()
    speaker_stats = db.query(SpeakerStatistic).filter(SpeakerStatistic.meeting_id == meeting.id).all()
    speakers_db = db.query(Speaker).filter(Speaker.meeting_id == meeting.id).all()
    
    # Map speaker UUID string -> speaker_label (e.g. "Minh vẽ", "Đức cớp", "Khánh")
    speaker_map = {str(spk.id): spk.speaker_label for spk in speakers_db}
    
    def resolve_speaker_name(spk_id_raw):
        if not spk_id_raw:
            return "Thành viên"
        spk_str = str(spk_id_raw)
        if spk_str in speaker_map:
            return speaker_map[spk_str]
        if spk_str.startswith("SPEAKER_"):
            return spk_str.replace("SPEAKER_", "Thành viên ")
        return spk_str

    seg_list = [{
        "speaker": resolve_speaker_name(s.speaker_id),
        "speaker_id": str(s.speaker_id) if s.speaker_id else "",
        "start": s.start_time,
        "end": s.end_time,
        "text": s.content
    } for s in segments]
    
    spk_list = [{
        "speaker_id": str(s.speaker_id) if s.speaker_id else "",
        "name": resolve_speaker_name(s.speaker_id),
        "total_time": s.total_speaking_time
    } for s in speaker_stats]

    custom_template_text = None
    if template_type == "custom" and custom_template:
        content_bytes = await custom_template.read()
        if len(content_bytes) > 100 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File template vượt quá dung lượng tối đa 100MB.")
        try:
            custom_template_text = parse_custom_template(content_bytes, custom_template.filename)
        except ValueError as ve:
            raise HTTPException(status_code=400, detail=str(ve))

    # Generate AI structured report content strictly from transcript
    report_data = generate_report_content(
        meeting_title=meeting.title,
        segments=seg_list,
        speaker_stats=spk_list,
        template_type=template_type,
        custom_template_text=custom_template_text
    )

    # Build PDF bytes with meeting creation date
    pdf_bytes = build_pdf_report(report_data, meeting_date=meeting.created_at)

    encoded_title = urllib.parse.quote(f"Bao_Cao_Cuoc_Hop_{meeting.title}.pdf")
    ascii_filename = f"Bao_Cao_Cuoc_Hop_{meeting.id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{ascii_filename}"; filename*=UTF-8\'\'{encoded_title}'
        }
    )

