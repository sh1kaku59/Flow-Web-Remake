from sqlalchemy import Column, String, DateTime, Numeric, Integer, ForeignKey, func, BigInteger
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.infrastructure.database.session import Base

class Meeting(Base):
    __tablename__ = "tbl_meeting"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String, nullable=True)
    topic = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)

class Speaker(Base):
    __tablename__ = "tbl_speaker"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    voice_sample_id = Column(UUID(as_uuid=True), nullable=True)
    speaker_label = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AudioFile(Base):
    __tablename__ = "tbl_audio_file"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    file_url = Column(String, nullable=False)
    duration = Column(Numeric, nullable=False)
    file_size = Column(BigInteger, nullable=True)
    format = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcessingJob(Base):
    __tablename__ = "tbl_processing_job"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    status = Column(String, nullable=False, default="Pending")
    job_type = Column(String, nullable=False)
    progress_percent = Column(Numeric, nullable=False, default=0)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProcessingStep(Base):
    __tablename__ = "tbl_processing_step"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey('tbl_processing_job.id'), nullable=False)
    step_name = Column(String, nullable=False)
    step_order = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="Pending")
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(String, nullable=True)
