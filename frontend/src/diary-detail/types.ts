export interface TranscriptSegment {
 id: string;
 meeting_id: string;
 speaker_id: string;
 content: string;
 start_time: number;
 end_time: number;
 topicLabel?: string;
}

export interface Speaker {
 id: string;
 speakers_name: string;
 avatar_url: string;
 is_identified: boolean;
 color?: string;
}

export type MeetingStatus = "Pending" | "Processing" | "Completed" | "Failed";

export interface Meeting {
 id: string;
 title: string;
 topic?: string;
 status?: MeetingStatus;
 created_at?: string;
 audio_url: string;
 duration?: number;
}

export interface Topic {
 label: string;
 start: number;
 end: number;
 summary: string;
}

export interface DiaryDetailData {
 meeting: Meeting;
 speakers: Speaker[];
 transcriptSegments: TranscriptSegment[];
 topics: Topic[];
 summary: string | null;
 summaryData?: SummaryData | null;
 chartData?: ChartAnalyticsData | null;
}

export type FilterType = "Content" | "Speaker" | "Timestamp" | "Topic";

export interface TimestampOption {
 label: string;
 start: number;
 end: number;
}

// ─── Summary Panel ──────────────────────────────────────────────────────────
export interface SummarySection {
 title: string;
 items: string[];
}

export interface SummaryData {
 overview?: string;
 sections: SummarySection[];
}

// ─── Chart Analytics Panel ──────────────────────────────────────────────────
export interface SpeakerStat {
 id: string;
 name: string;
 color: string; // hex color for the chart
 speakingTimeSec: number;
 speakingTimeFormatted: string; // e.g. "17:21"
 percentage: number; // e.g. 45.2
 turns: number;
}

export interface TopicTransition {
 label: string;
 startTimeLabel: string; // e.g. "05:30"
 positionPercent: number; // 0-100, position on timeline
 colorHex: string;
 bgColorHex: string;
 percentage?: number; // e.g. 45
 start?: number;
 end?: number;
}

export interface IntensityPoint {
 timeSec: number;
 timeLabel: string;
 value: number; // 0–100
}

export interface ChartAnalyticsData {
 totalDurationLabel: string; // e.g. "35:00"
 speakers: SpeakerStat[];
 topics: TopicTransition[];
 peakTimeLabel: string; // e.g. "16:30"
 intensityPoints: IntensityPoint[];
 insightText: string;
}
