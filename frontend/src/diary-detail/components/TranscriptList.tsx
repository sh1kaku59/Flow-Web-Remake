import { ReactNode, useEffect, useMemo, useRef } from "react";
import { Speaker, TranscriptSegment } from "../types";
import { formatTime } from "../utils";

interface TranscriptListProps {
 segments: TranscriptSegment[];
 speakersById: Record<string, Speaker>;
 activeSegmentId: string | null;
 highlightKeyword?: string;
 onSegmentClick: (segment: TranscriptSegment) => void;
}

function escapeRegExp(value: string): string {
 return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedText(content: string, keyword: string): ReactNode {
 const trimmedKeyword = keyword.trim();
 if (!trimmedKeyword) {
  return content;
 }

 const regex = new RegExp(`(${escapeRegExp(trimmedKeyword)})`, "gi");
 const parts = content.split(regex);

 return parts.map((part, index) => {
  if (part.toLowerCase() !== trimmedKeyword.toLowerCase()) {
   return <span key={`${part}-${index}`}>{part}</span>;
  }

  return (
   <mark
    key={`${part}-${index}`}
    style={{ backgroundColor: "transparent" }}
    className="rounded-md px-1 dark:text-white text-purple-900 font-bold border border-purple-500/50 dark:bg-purple-500/30 bg-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
   >
    {part}
   </mark>
  );
 });
}

export function TranscriptList({
 segments,
 speakersById,
 activeSegmentId,
 highlightKeyword = "",
 onSegmentClick,
}: TranscriptListProps) {
 const refs = useRef<Record<string, HTMLButtonElement | null>>({});

 useEffect(() => {
  if (!activeSegmentId) {
   return;
  }
  const target = refs.current[activeSegmentId];
  if (target) {
   target.scrollIntoView({ block: "center", behavior: "smooth" });
  }
 }, [activeSegmentId]);

 const list = useMemo(
  () =>
   segments.map((segment) => {
    const speaker = speakersById[segment.speaker_id];
    const speakerName = speaker?.speakers_name ?? "Unknown";
    const active = segment.id === activeSegmentId;

    return (
     <button
      key={segment.id}
      type="button"
      ref={(node) => {
       refs.current[segment.id] = node;
      }}
      onClick={() => onSegmentClick(segment)}
      className={`group relative mb-[12px] w-full overflow-hidden rounded-[14px] border px-[16px] py-[12px] text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
       active
        ? "dark:border-purple-500/50 dark:bg-purple-950/40 border-purple-400 bg-purple-50/90 dark:shadow-[0_0_20px_rgba(168,85,247,0.25)] shadow-md"
        : "dark:border-transparent border-gray-200/80 dark:bg-white/5 bg-white dark:hover:bg-white/10 hover:bg-gray-50 dark:hover:border-white/10 hover:border-gray-300 shadow-sm"
      }`}
     >
      <span
       className={`pointer-events-none absolute left-0 top-[10px] h-[calc(100%-20px)] w-[4px] rounded-r-full transition-opacity duration-200 ${
        active
         ? "opacity-100 bg-gradient-to-b from-purple-500 to-cyan-400"
         : "opacity-0 group-hover:opacity-50 dark:bg-white/20 bg-purple-300"
       }`}
      />

       <div className="flex w-full flex-col">
        <div className="mb-[8px] flex w-full items-center justify-between">
         <span className="text-[11px] font-semibold tracking-[0.2px] dark:text-gray-400 text-gray-600">
          {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
         </span>
         {segment.topicLabel && (
          <span className="rounded-full dark:bg-white/10 bg-gray-100 px-2 py-0.5 text-[10px] font-medium dark:text-gray-400 text-gray-700 border dark:border-transparent border-gray-200">
           {segment.topicLabel}
          </span>
         )}
        </div>

        <div className="flex items-start gap-[12px]">
         <span className="flex h-[36px] w-[36px] flex-none items-center justify-center">
          <span
           className="flex h-[32px] w-[32px] items-center justify-center rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] text-white text-[14px] font-bold"
           style={{ backgroundColor: speaker?.color || "#6b7280" }}
          >
           {speakerName.charAt(0).toUpperCase()}
          </span>
         </span>

         <div className="min-w-0 flex-1 pt-[2px] pr-[4px] text-[16px] leading-[1.58] dark:text-gray-100 text-gray-900 font-medium">
          <span className="font-bold mr-1" style={{ color: speaker?.color || "#6b7280" }}>{speakerName}:</span>
          <span>
           {renderHighlightedText(segment.content, highlightKeyword)}
          </span>
         </div>
        </div>
      </div>
     </button>
    );
   }),
  [activeSegmentId, highlightKeyword, onSegmentClick, segments, speakersById]
 );

 if (segments.length === 0) {
  return (
   <div className="flex h-[220px] items-center justify-center rounded-[12px] border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-white text-[14px] font-medium dark:text-gray-400 text-gray-600 shadow-sm">
    No transcript segments found.
   </div>
  );
 }

 return <>{list}</>;
}
