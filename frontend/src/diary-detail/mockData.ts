import { Speaker, TranscriptSegment, SummaryData, ChartAnalyticsData } from "./types";

export const speakersMock: Speaker[] = [
 {
  id: "speaker-001",
  speakers_name: "John",
  avatar_url: "",
  is_identified: true,
 },
 {
  id: "speaker-002",
  speakers_name: "Jane",
  avatar_url: "",
  is_identified: true,
 },
 {
  id: "speaker-003",
  speakers_name: "Joe",
  avatar_url: "",
  is_identified: true,
 },
];

const transcriptSegmentsByMeetingId: Record<string, TranscriptSegment[]> = {
 "meeting-004": [
  {
   id: "segment-004-001",
   meeting_id: "meeting-004",
   speaker_id: "speaker-001",
   content: "We reviewed team retrospective action points and ownership updates.",
   start_time: 9,
   end_time: 12,
  },
  {
   id: "segment-004-002",
   meeting_id: "meeting-004",
   speaker_id: "speaker-002",
   content:
    "Team building budget and activity timeline were confirmed with clear deadlines and responsibilities.",
   start_time: 13,
   end_time: 18,
  },
  {
   id: "segment-004-003",
   meeting_id: "meeting-004",
   speaker_id: "speaker-003",
   content:
    "Follow-up includes venue shortlist, participant survey, and final approval from HR before execution.",
   start_time: 20,
   end_time: 28,
  },
  {
   id: "segment-004-004",
   meeting_id: "meeting-004",
   speaker_id: "speaker-001",
   content:
    "Risks were raised around attendance and budget drift, then mitigation actions were assigned.",
   start_time: 38,
   end_time: 44,
  },
  {
   id: "segment-004-005",
   meeting_id: "meeting-004",
   speaker_id: "speaker-002",
   content:
    "Next checkpoint will validate execution readiness, summary notes, and chart outputs for leadership.",
   start_time: 45,
   end_time: 49,
  },
 ],
 "meeting-003": [
  {
   id: "segment-003-001",
   meeting_id: "meeting-003",
   speaker_id: "speaker-001",
   content:
    "Budget variance this quarter is mainly from infrastructure expansion and vendor price adjustments.",
   start_time: 6,
   end_time: 14,
  },
  {
   id: "segment-003-002",
   meeting_id: "meeting-003",
   speaker_id: "speaker-002",
   content:
    "Finance proposed reallocating discretionary spend to protect product roadmap milestones.",
   start_time: 16,
   end_time: 24,
  },
  {
   id: "segment-003-003",
   meeting_id: "meeting-003",
   speaker_id: "speaker-003",
   content:
    "We agreed to monitor monthly burn rate and trigger alerts when forecast exceeds threshold.",
   start_time: 27,
   end_time: 35,
  },
  {
   id: "segment-003-004",
   meeting_id: "meeting-003",
   speaker_id: "speaker-001",
   content:
    "Action items include updated budget dashboard, summary export, and risk annotations by next review.",
   start_time: 42,
   end_time: 51,
  },
 ],
};

export const mockAudioUrlByMeetingId: Record<string, string> = {
 // "meeting-001": "https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedia_-_Earth_(spoken_by_AI_voice).mp3",
 // "meeting-002": "https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedia_-_Bill_Gates.mp3",
 "meeting-003": "https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedia_-_Artificial_intelligence_(spoken_by_AI_voice).mp3",
 "meeting-004": "https://commons.wikimedia.org/wiki/Special:FilePath/Nicholasdr_15_moore_64kb.mp3",
 // "meeting-005": "https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedia_-_Human.mp3",
 // "meeting-006": "https://commons.wikimedia.org/wiki/Special:FilePath/Little_wars_chapter3_wells_64kb.mp3",
 // "meeting-007": "https://commons.wikimedia.org/wiki/Special:FilePath/Microbehunters_30_dekruif_64kb.mp3",
};

export function getTranscriptSegmentsByMeetingId(meetingId: string): TranscriptSegment[] {
 const segments = transcriptSegmentsByMeetingId[meetingId] ?? [];
 return segments.map((segment) => ({ ...segment }));
}

// ─── Summary mock data ───────────────────────────────────────────────────────────────
export const summaryDataByMeetingId: Record<string, SummaryData> = {
 "meeting-004": {
  sections: [
   {
    title: "Project Kickoff",
    items: [
     "The team set the project scope and goals, highlighting the importance of client communication and team collaboration.",
     "Responsibilities were allocated among team members, with John Doe assigned to lead.",
    ],
   },
   {
    title: "Budget Planning",
    items: [
     "A budget of $50,000 was agreed upon to cover development and initial marketing activities.",
     "Key expenses include software licenses, marketing campaigns, and equipment procurement.",
    ],
   },
   {
    title: "Next Steps",
    items: [
     "Schedule follow-up review sessions for each department head by end of week.",
     "Finalize vendor contracts and obtain board approval before project launch.",
     "Set up a shared project tracker and communication channel for the team.",
    ],
   },
  ],
 },
 "meeting-003": {
  sections: [
   {
    title: "Budget Variance Review",
    items: [
     "Budget variance this quarter is mainly from infrastructure expansion and vendor price adjustments.",
     "Finance proposed reallocating discretionary spend to protect product roadmap milestones.",
    ],
   },
   {
    title: "Risk Management",
    items: [
     "We agreed to monitor monthly burn rate and trigger alerts when forecast exceeds threshold.",
     "Contingency reserves will be reviewed at each milestone checkpoint.",
    ],
   },
   {
    title: "Action Items",
    items: [
     "Update budget dashboard and export summary by next review cycle.",
     "Annotate risk items and share with the finance lead for sign-off.",
    ],
   },
  ],
 },
};

// ─── Chart analytics mock data ───────────────────────────────────────────────────────
export const chartDataByMeetingId: Record<string, ChartAnalyticsData> = {
 "meeting-004": {
  totalDurationLabel: "35:00",
  speakers: [
   { id: "speaker-001", name: "John Doe", color: "#7C6AE8", speakingTimeSec: 1041, speakingTimeFormatted: "17:21", percentage: 45.2, turns: 12 },
   { id: "speaker-002", name: "Jane Doe", color: "#EF8080", speakingTimeSec: 692, speakingTimeFormatted: "11:32", percentage: 30.0, turns: 8 },
   { id: "speaker-003", name: "Joe Doe", color: "#4EC8E4", speakingTimeSec: 571, speakingTimeFormatted: "09:31", percentage: 24.8, turns: 6 },
  ],
  topics: [
   { label: "Introduction",    startTimeLabel: "00:00", positionPercent: 0,   colorHex: "#13b9ef", bgColorHex: "#e0f7ff" },
   { label: "Planning Discussion", startTimeLabel: "05:30", positionPercent: 15.7, colorHex: "#22c55e", bgColorHex: "#dcfce7" },
   { label: "Budget Review",    startTimeLabel: "15:30", positionPercent: 44.3, colorHex: "#f97316", bgColorHex: "#fff7ed" },
   { label: "Conclusion",     startTimeLabel: "25:30", positionPercent: 72.9, colorHex: "#d946ef", bgColorHex: "#fdf4ff" },
  ],
  peakTimeLabel: "16:30",
  intensityPoints: [
   { timeSec: 0,  timeLabel: "00:00", value: 10 },
   { timeSec: 300, timeLabel: "05:00", value: 28 },
   { timeSec: 600, timeLabel: "10:00", value: 72 },
   { timeSec: 840, timeLabel: "14:00", value: 50 },
   { timeSec: 990, timeLabel: "16:30", value: 82 },
   { timeSec: 1200, timeLabel: "20:00", value: 42 },
   { timeSec: 1500, timeLabel: "25:00", value: 28 },
   { timeSec: 1800, timeLabel: "30:00", value: 55 },
   { timeSec: 2100, timeLabel: "35:00", value: 88 },
  ],
  insightText:
   "John Doe dominated the discussion, especially during the planning phase. The conversation became most intense around 16:30 during the budget discussion.",
 },
 "meeting-003": {
  totalDurationLabel: "52:10",
  speakers: [
   { id: "speaker-001", name: "John Doe", color: "#7C6AE8", speakingTimeSec: 1250, speakingTimeFormatted: "20:50", percentage: 40.1, turns: 10 },
   { id: "speaker-002", name: "Jane Doe", color: "#EF8080", speakingTimeSec: 940, speakingTimeFormatted: "15:40", percentage: 30.1, turns: 7 },
   { id: "speaker-003", name: "Joe Doe", color: "#4EC8E4", speakingTimeSec: 930, speakingTimeFormatted: "15:30", percentage: 29.8, turns: 6 },
  ],
  topics: [
   { label: "Opening",    startTimeLabel: "00:00", positionPercent: 0,  colorHex: "#13b9ef", bgColorHex: "#e0f7ff" },
   { label: "Budget Analysis", startTimeLabel: "08:00", positionPercent: 15.3, colorHex: "#22c55e", bgColorHex: "#dcfce7" },
   { label: "Reallocation", startTimeLabel: "28:00", positionPercent: 53.7, colorHex: "#f97316", bgColorHex: "#fff7ed" },
   { label: "Wrap-up",    startTimeLabel: "45:00", positionPercent: 86.3, colorHex: "#d946ef", bgColorHex: "#fdf4ff" },
  ],
  peakTimeLabel: "32:00",
  intensityPoints: [
   { timeSec: 0,  timeLabel: "00:00", value: 15 },
   { timeSec: 480, timeLabel: "08:00", value: 35 },
   { timeSec: 960, timeLabel: "16:00", value: 55 },
   { timeSec: 1440, timeLabel: "24:00", value: 65 },
   { timeSec: 1920, timeLabel: "32:00", value: 85 },
   { timeSec: 2400, timeLabel: "40:00", value: 48 },
   { timeSec: 2700, timeLabel: "45:00", value: 30 },
   { timeSec: 3130, timeLabel: "52:10", value: 20 },
  ],
  insightText:
   "Jane Doe and Joe Doe contributed equally, while John Doe led the budget analysis discussion. Intensity peaked during the reallocation debate around 32:00.",
 },
};
