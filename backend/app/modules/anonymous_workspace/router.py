from fastapi import APIRouter, Response, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import secrets
import hashlib
from app.infrastructure.database.session import get_db
from app.bootstrap.config import settings
from .models import AnonymousWorkspace

router = APIRouter(prefix="/workspaces", tags=["Workspace"])

def hash_capability(capability: str) -> str:
    return hashlib.sha256(f"{capability}{settings.SECRET_KEY}".encode()).hexdigest()

@router.post("/start")
def start_workspace(response: Response, db: Session = Depends(get_db)):
    capability = secrets.token_urlsafe(32)
    digest = hash_capability(capability)
    
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    workspace = AnonymousWorkspace(
        capability_digest=digest,
        status="active",
        expires_at=expires_at
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=capability,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "workspace_state": workspace.status,
        "expires_at": workspace.expires_at.isoformat(),
        "voice_sample_readiness": False
    }

@router.get("/current")
def current_workspace(request: Request, db: Session = Depends(get_db)):
    capability = request.cookies.get(settings.COOKIE_NAME)
    if not capability:
        raise HTTPException(status_code=401, detail="No workspace capability found")
        
    digest = hash_capability(capability)
    workspace = db.query(AnonymousWorkspace).filter(
        AnonymousWorkspace.capability_digest == digest,
        AnonymousWorkspace.deleted_at.is_(None)
    ).first()
    
    if not workspace or workspace.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Workspace expired or invalid")
        
    workspace.last_seen_at = datetime.now(timezone.utc)
    db.commit()
    
    return {
        "workspace_state": workspace.status,
        "expires_at": workspace.expires_at.isoformat(),
        "voice_sample_readiness": False # TODO: Calculate actual readiness
    }
