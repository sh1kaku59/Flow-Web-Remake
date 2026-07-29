from uuid import UUID
from typing import NewType

WorkspaceId = NewType('WorkspaceId', UUID)
MeetingId = NewType('MeetingId', UUID)
AudioFileId = NewType('AudioFileId', UUID)
TranscriptSegmentId = NewType('TranscriptSegmentId', UUID)
SpeakerId = NewType('SpeakerId', UUID)
VoiceSampleId = NewType('VoiceSampleId', UUID)
JobId = NewType('JobId', UUID)
