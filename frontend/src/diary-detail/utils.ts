export function formatTime(seconds: number): string {
 const safe = Math.max(0, Math.floor(seconds));
 const minutes = Math.floor(safe / 60);
 const remain = safe % 60;
 return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(
  2,
  "0"
 )}`;
}
