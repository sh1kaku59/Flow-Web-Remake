import { getTranscriptSegmentsByMeetingId, mockAudioUrlByMeetingId, speakersMock } from "./mockData";
import { DiaryDetailData, FilterType, Meeting, MeetingStatus, TranscriptSegment, SummarySection } from "./types";
import { fetchMeetingForDetail } from "../shared/meetingGateway";

export interface FiltersState {
 filterType: FilterType;
 contentKeyword: string;
 speakerId: string;
 timestampRange: string;
 globalQuery: string;
 topicLabel: string;
}

const sleep = (ms: number) =>
 new Promise((resolve) => {
  window.setTimeout(resolve, ms);
 });

const normalize = (value: string) => value.trim().toLowerCase();

function parseRangeLabelToSeconds(label: string): [number, number] | null {
 const match = label.match(/^(\d{2,}):(\d{2})\s*-\s*(\d{2,}):(\d{2})$/);
 if (!match) {
  return null;
 }

 const start = Number(match[1]) * 60 + Number(match[2]);
 const end = Number(match[3]) * 60 + Number(match[4]);
 return [start, end];
}

function normalizeMeetingForDetail(
 source: Awaited<ReturnType<typeof fetchMeetingForDetail>>
): Meeting | null {
 if (!source) {
  return null;
 }

 const fallbackAudio = mockAudioUrlByMeetingId[source.id] ?? mockAudioUrlByMeetingId["meeting-004"];

 return {
  id: source.id,
  title: source.title,
  topic: source.topic,
  status: source.status,
  created_at: source.created_at,
  duration: source.duration ?? undefined,
  audio_url: source.audio_url || fallbackAudio,
 };
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1").replace(/\/+$/, "");

export function resolveSupabaseAudioUrl(audioPathOrUrl: string): string {
 if (!audioPathOrUrl) {
  return mockAudioUrlByMeetingId["meeting-004"];
 }

 // If it's a supabase URL or already absolute, return it
 if (/^https?:\/\//i.test(audioPathOrUrl)) {
  return audioPathOrUrl;
 }

 return audioPathOrUrl;
}

export async function fetchDiaryDetail(meetingId: string): Promise<DiaryDetailData> {
 const isMock = String(import.meta.env.VITE_USE_MOCK_DIARY ?? "true").toLowerCase() === "true";
 
 if (isMock) {
  await sleep(120);
  const selectedMeeting = await fetchMeetingForDetail(meetingId);
  const meeting = normalizeMeetingForDetail(selectedMeeting);
  if (!meeting) throw new Error("Diary not found.");
  return { meeting, speakers: speakersMock, transcriptSegments: getTranscriptSegmentsByMeetingId(meetingId), topics: [], summary: null };
 }
 
 // Real API call
 const response = await fetch(`${API_BASE_URL}/meetings/${encodeURIComponent(meetingId)}`);
 if (!response.ok) {
  throw new Error("Failed to fetch meeting detail");
 }
 const data = await response.json();
 
 // Extract summary
 let summary = null;
 if (data.summary) {
   // You can parse summary here if needed, currently it's just a raw text from Gemini
 }
 
 // Normalize meeting
 const meeting: Meeting = {
  id: data.id,
  title: data.title,
  topic: data.topic,
  status: data.status as MeetingStatus,
  created_at: data.created_at,
  audio_url: data.audio_url || "",
 };
 
 // Parse real speakers array
 const SPEAKER_COLORS = ["#d946ef", "#13b9ef", "#22c55e", "#f97316", "#a855f7"];
 const speakersMap = new Map<string, any>();
 
 (data.speakers || []).forEach((spk: any, idx: number) => {
   speakersMap.set(spk.id, {
    id: spk.id,
    name: spk.name || `Speaker ${idx + 1}`,
    color: SPEAKER_COLORS[idx % SPEAKER_COLORS.length],
    avatar_url: null, // Will render initials instead
    totalSpeakingTime: spk.total_speaking_time || 0,
    turns: spk.number_of_speeches || 0,
   });
 });
 
 // If speakers array is missing from backend, fallback to transcript iteration
 if (speakersMap.size === 0) {
  (data.transcript || []).forEach((seg: any) => {
    if (!speakersMap.has(seg.speaker)) {
     const idx = speakersMap.size;
     speakersMap.set(seg.speaker, {
       id: seg.speaker,
       name: `Speaker ${idx + 1}`,
       color: SPEAKER_COLORS[idx % SPEAKER_COLORS.length],
       avatar_url: null,
       totalSpeakingTime: 0,
       turns: 0,
     });
    }
  });
 }
 
 const topics = data.topics || [];
 
 // Map transcript segments
 const transcriptSegments: TranscriptSegment[] = (data.transcript || []).map((seg: any, idx: number) => {
  // Find which topic this segment belongs to
  const midPoint = (seg.start + seg.end) / 2;
  const matchedTopic = topics.find((t: any) => t.start <= midPoint && t.end >= midPoint) 
                       || topics.find((t: any) => t.start <= seg.start && t.end >= seg.start);
  
  return {
   id: `seg-${idx}`,
   meeting_id: meeting.id,
   speaker_id: seg.speaker || "Unknown",
   content: seg.text || "",
   start_time: seg.start,
   end_time: seg.end,
   topicLabel: matchedTopic ? matchedTopic.label : undefined
  };
 });
 
 // Compute Chart Data
 const totalDurationSec = Array.from(speakersMap.values()).reduce((sum, s) => sum + s.totalSpeakingTime, 0) || 1;
 const chartSpeakers = Array.from(speakersMap.values()).map(s => {
  const mins = Math.floor(s.totalSpeakingTime / 60);
  const secs = Math.floor(s.totalSpeakingTime % 60);
  return {
   id: s.id,
   name: s.name,
   speakingTimeSec: s.totalSpeakingTime,
   speakingTimeFormatted: `${mins}m ${secs}s`,
   percentage: (s.totalSpeakingTime / totalDurationSec) * 100,
   color: s.color,
   turns: s.turns
  };
 });
 
 const TOPIC_COLORS = ["#f97316", "#eab308", "#10b981", "#3b82f6", "#8b5cf6"];
 const chartTopics = topics.map((t: any, i: number) => {
  const mins = Math.floor(t.start / 60);
  const secs = Math.floor(t.start % 60).toString().padStart(2, '0');
  return {
   label: t.label,
   colorHex: TOPIC_COLORS[i % TOPIC_COLORS.length],
   bgColorHex: `${TOPIC_COLORS[i % TOPIC_COLORS.length]}20`,
   startTimeLabel: `${mins}:${secs}`
  };
 });
 
 // Generate pseudo-intensity based on transcript segments overlap and turns
 const intensityPoints = [];
 const maxEnd = transcriptSegments.length > 0 ? transcriptSegments[transcriptSegments.length - 1].end_time : 0;
 const bucketSize = Math.max(10, Math.floor(maxEnd / 10)); // max 10 buckets
 
 for(let t = 0; t <= maxEnd; t += bucketSize) {
  let count = 0;
  transcriptSegments.forEach(seg => {
    if (seg.start_time >= t && seg.start_time < t + bucketSize) count++;
  });
  const val = Math.min(100, count * 15); // mock formula
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  intensityPoints.push({ timeSec: t, value: val, timeLabel: `${m}:${s}` });
 }
 if(intensityPoints.length === 0) intensityPoints.push({timeSec: 0, value: 0, timeLabel: "0:00"});
 
 const chartData = {
  speakers: chartSpeakers,
  totalDurationLabel: Math.floor(totalDurationSec / 60).toString(),
  topics: chartTopics,
  intensityPoints: intensityPoints,
  peakTimeLabel: intensityPoints.reduce((p, c) => (p.value > c.value ? p : c), intensityPoints[0]).timeLabel,
  insightText: data.summary || "Summary generation is in progress or not available."
 };
 
 // Parse Summary string into SummaryData
 let summaryData = null;
 if (data.summary) {
  // Simple markdown parsing to find sections and bullets
  const lines = data.summary.split('\n');
  const sections: SummarySection[] = [];
  let currentSection: SummarySection | null = null;
  
  lines.forEach((line: string) => {
   const trimmed = line.trim();
   if (!trimmed) return;
   
   if (trimmed.startsWith('##') || (trimmed.startsWith('**') && trimmed.endsWith('**'))) {
    if (currentSection) sections.push(currentSection);
    currentSection = { title: trimmed.replace(/#/g, '').replace(/\*/g, '').trim(), items: [] };
   } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
    if (!currentSection) currentSection = { title: "Overview", items: [] };
    currentSection.items.push(trimmed.replace(/^[-*]\s*/, '').trim());
   } else {
    if (!currentSection) currentSection = { title: "Overview", items: [] };
    currentSection.items.push(trimmed);
   }
  });
  if (currentSection) sections.push(currentSection);
  
  if (sections.length > 0) {
   summaryData = { sections };
  } else {
   summaryData = { sections: [{ title: "Overview", items: [data.summary] }] };
  }
 }
 
 return {
  meeting,
  speakers: Array.from(speakersMap.values()).map(s => ({
    id: s.id,
    speakers_name: s.name,
    avatar_url: "",
    is_identified: true,
    color: s.color
  })),
  transcriptSegments,
  topics,
  summary: data.summary,
  summaryData: summaryData,
  chartData: chartData
 };
}

export function filterTranscriptSegments(
 source: TranscriptSegment[],
 filters: FiltersState,
 topics: any[] = []
): TranscriptSegment[] {
 const contentKeyword = normalize(filters.contentKeyword);
 const globalQuery = normalize(filters.globalQuery);

 const timestampRange =
  filters.timestampRange === ""
   ? null
   : parseRangeLabelToSeconds(filters.timestampRange);

 return source.filter((segment) => {
  const byGlobalQuery =
   globalQuery === "" || normalize(segment.content).includes(globalQuery);

  if (filters.filterType === "Content") {
   const byContent =
    contentKeyword === "" || normalize(segment.content).includes(contentKeyword);
   return byGlobalQuery && byContent;
  }

  if (filters.filterType === "Speaker") {
   const bySpeaker =
    filters.speakerId === "" ||
    normalize(filters.speakerId) === "all" ||
    segment.speaker_id === filters.speakerId;
   return byGlobalQuery && bySpeaker;
  }

  if (filters.filterType === "Timestamp") {
   if (!timestampRange) {
    return byGlobalQuery;
   }
   const [rangeStart, rangeEnd] = timestampRange;
   // Exact range label match or strict interior overlap (start_time < rangeEnd && end_time > rangeStart)
   const isExactMatch =
    Math.abs(segment.start_time - rangeStart) < 1 &&
    Math.abs(segment.end_time - rangeEnd) < 1;
   const strictOverlap =
    segment.start_time < rangeEnd && segment.end_time > rangeStart;
   return byGlobalQuery && (isExactMatch || strictOverlap);
  }
  
  if (filters.filterType === "Topic") {
   if (!filters.topicLabel || normalize(filters.topicLabel) === "all") {
    return byGlobalQuery;
   }
   
   // Check assigned topicLabel first for exact topic match
   if (segment.topicLabel) {
    const isExactTopic = normalize(segment.topicLabel) === normalize(filters.topicLabel);
    return byGlobalQuery && isExactTopic;
   }

   const topic = topics.find(t => normalize(t.label) === normalize(filters.topicLabel));
   if (!topic) return byGlobalQuery;
   
   const strictOverlap = segment.start_time < topic.end && segment.end_time > topic.start;
   return byGlobalQuery && strictOverlap;
  }

  return byGlobalQuery;
 });
}
