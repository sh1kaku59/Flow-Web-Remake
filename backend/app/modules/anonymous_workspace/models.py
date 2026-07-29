from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.infrastructure.database.session import Base

class AnonymousWorkspace(Base):
    __tablename__ = "tbl_anonymous_workspace"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    capability_digest = Column(String, nullable=False, unique=True)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
