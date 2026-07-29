from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database.session import get_db
from app.shared_kernel.policies.workspace_context import get_workspace_context
from app.modules.anonymous_workspace.models import AnonymousWorkspace
from app.modules.meeting_processing.models import Meeting
from app.modules.meeting_intelligence.models import SearchIndex
import uuid
import sys
import os

# Ensure worker module is in path if necessary
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..")))
from worker.pipelines.semantic_service import generate_embedding

router = APIRouter(prefix="/meetings", tags=["Semantic Search"])

@router.get("/semantic-search")
def search_workspace_transcripts(
    query: str,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    try:
        query_embedding = generate_embedding(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate embedding")
    
    results = db.query(SearchIndex, Meeting).join(
        Meeting, SearchIndex.meeting_id == Meeting.id
    ).filter(
        SearchIndex.workspace_id == workspace.id
    ).order_by(
        SearchIndex.embedding.cosine_distance(query_embedding)
    ).limit(10).all()
    
    return [
        {
            "segment_id": str(idx.segment_id),
            "meeting_id": str(meet.id),
            "meeting_title": meet.title,
            "content": idx.content_text,
        }
        for idx, meet in results
    ]

@router.get("/{meeting_id}/semantic-search")
def search_meeting_transcripts(
    meeting_id: uuid.UUID,
    query: str,
    db: Session = Depends(get_db),
    workspace: AnonymousWorkspace = Depends(get_workspace_context)
):
    # Verify meeting belongs to workspace
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id, Meeting.workspace_id == workspace.id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    try:
        query_embedding = generate_embedding(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate embedding")
    
    results = db.query(SearchIndex).filter(
        SearchIndex.meeting_id == meeting_id,
        SearchIndex.workspace_id == workspace.id
    ).order_by(
        SearchIndex.embedding.cosine_distance(query_embedding)
    ).limit(10).all()
    
    return [
        {
            "segment_id": str(idx.segment_id),
            "meeting_id": str(idx.meeting_id),
            "content": idx.content_text,
        }
        for idx in results
    ]
