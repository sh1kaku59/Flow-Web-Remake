export type MeetingStatus = "Pending" | "Processing" | "Completed" | "Failed";

export type SortOption =
 | "Most Recent"
 | "Oldest"
 | "A → Z"
 | "Z → A"
 | "Duration";

export interface Meeting {
 id: string;
 title: string;
 topic?: string;
 status: MeetingStatus;
 created_at: string;
 duration?: number | null;
 audio_url?: string;
}
