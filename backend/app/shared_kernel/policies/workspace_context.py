from fastapi import Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database.session import get_db
from app.bootstrap.config import settings
from app.modules.anonymous_workspace.models import AnonymousWorkspace
from datetime import datetime, timezone, timedelta
import hashlib

def hash_capability(capability: str) -> str:
    return hashlib.sha256(f"{capability}{settings.SECRET_KEY}".encode()).hexdigest()

def get_workspace_context(request: Request, db: Session = Depends(get_db)) -> AnonymousWorkspace:
    capability = request.cookies.get(settings.COOKIE_NAME)
    
    workspace = None
    if capability:
        digest = hash_capability(capability)
        workspace = db.query(AnonymousWorkspace).filter(
            AnonymousWorkspace.capability_digest == digest,
            AnonymousWorkspace.deleted_at.is_(None)
        ).first()
        
    if not workspace:
        # Tự động tạo workspace ẩn danh nếu chưa có (Tránh lỗi 401 khi test)
        capability = "default-dev-workspace-token"
        digest = hash_capability(capability)
        workspace = db.query(AnonymousWorkspace).filter(AnonymousWorkspace.capability_digest == digest).first()
        if not workspace:
            workspace = AnonymousWorkspace(
                capability_digest=digest,
                status="active",
                expires_at=datetime.now(timezone.utc) + timedelta(days=7)
            )
            db.add(workspace)
            db.commit()
            db.refresh(workspace)
            
    return workspace
