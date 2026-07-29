export type UploadState =
 | "idle"
 | "selected"
 | "uploading"
 | "step1"
 | "step2"
 | "step3"
 | "completed";

export interface SelectedFile {
 file: File;
 name: string;
 duration?: string; // Optional: mocking duration until actual parsing
}
