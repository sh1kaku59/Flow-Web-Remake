from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Float, Numeric
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
import uuid
from app.infrastructure.database.session import Base
from sqlalchemy.sql import func

class VoiceSample(Base):
    __tablename__ = "tbl_voice_sample"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), nullable=False)
    speaker_label = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    duration = Column(Numeric, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    embedding_vector = Column(Vector(512)) # Pyannote embedding vector size

class MeetingSummary(Base):
    __tablename__ = "tbl_meeting_summary"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TranscriptSegment(Base):
    __tablename__ = "tbl_transcript_segment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    speaker_id = Column(UUID(as_uuid=True), nullable=True) # Will point to tbl_speaker
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    content = Column(String, nullable=False)
    embedding = Column(Vector(3072))

class SemanticSegment(Base):
    __tablename__ = "tbl_semantic_segment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    topic_label = Column(String, nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    summary_content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SpeakerStatistic(Base):
    __tablename__ = "tbl_speaker_statistic"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    speaker_id = Column(UUID(as_uuid=True), nullable=False) # Reference to tbl_speaker
    total_speaking_time = Column(Float, nullable=False, default=0.0)
    number_of_speeches = Column(Integer, nullable=False, default=0)
    lively_discussion = Column(Numeric, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SearchIndex(Base):
    __tablename__ = "tbl_search_index"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey('tbl_meeting.id'), nullable=False)
    segment_id = Column(UUID(as_uuid=True), ForeignKey('tbl_transcript_segment.id'), nullable=False)
    workspace_id = Column(UUID(as_uuid=True), nullable=False)
    embedding = Column(Vector(3072)) # Gemini Embedding 001
    content_text = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
