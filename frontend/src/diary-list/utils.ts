export function formatDuration(duration?: number | null): string {
 if (duration === null || duration === undefined || Number.isNaN(duration)) {
  return "--:--";
 }

 const totalSeconds = Math.max(0, Math.floor(duration));
 const hours = Math.floor(totalSeconds / 3600);
 const minutes = Math.floor((totalSeconds % 3600) / 60);
 const seconds = totalSeconds % 60;

 if (hours > 0) {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
   2,
   "0"
  )}:${String(seconds).padStart(2, "0")}`;
 }

 return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDate(dateValue: string): string {
 const date = new Date(dateValue);
 if (Number.isNaN(date.getTime())) {
  return "--/--/--";
 }

 const day = String(date.getDate()).padStart(2, "0");
 const month = String(date.getMonth() + 1).padStart(2, "0");
 const year = String(date.getFullYear()).slice(-2);
 return `${day}/${month}/${year}`;
}

