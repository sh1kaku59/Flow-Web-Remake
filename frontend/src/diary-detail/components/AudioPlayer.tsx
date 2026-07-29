import { useEffect, useMemo, useRef, useState } from "react";
import { TranscriptSegment } from "../types";
import { formatTime } from "../utils";
import { PauseIcon, PlayTriangleIcon } from "./icons";
import { RotateCcw, RotateCw, Volume2, VolumeX, Gauge } from "lucide-react";

interface AudioPlayerProps {
 audioUrl: string;
 duration: number;
 currentTime: number;
 isPlaying: boolean;
 seekTo: number | null;
 segments: TranscriptSegment[];
 speakersById?: Record<string, any>;
 onSeekHandled: () => void;
 onTogglePlay: () => void;
 onSeek: (seconds: number) => void;
 onTimeUpdate: (seconds: number) => void;
 onEnded: () => void;
}

const SPEED_OPTIONS = [1, 1.25, 1.5, 2];

export function AudioPlayer({
 audioUrl,
 duration,
 currentTime,
 isPlaying,
 seekTo,
 segments,
 speakersById,
 onSeekHandled,
 onTogglePlay,
 onSeek,
 onTimeUpdate,
 onEnded,
}: AudioPlayerProps) {
 const audioRef = useRef<HTMLAudioElement>(null);
 const [dragValue, setDragValue] = useState<number | null>(null);
 const [hoveredLivelyId, setHoveredLivelyId] = useState<string | null>(null);
 const [playbackRate, setPlaybackRate] = useState<number>(1);
 const [volume, setVolume] = useState<number>(1);
 const [isMuted, setIsMuted] = useState<boolean>(false);
 const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);

 const displayTime = dragValue !== null ? dragValue : currentTime;
 const progressPercent = Math.min(100, Math.max(0, (displayTime / duration) * 100)) || 0;

 useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;
  if (isPlaying) {
   audio.play().catch(() => onEnded());
  } else {
   audio.pause();
  }
 }, [isPlaying, onEnded]);

 useEffect(() => {
  if (seekTo === null) return;
  const audio = audioRef.current;
  if (!audio) return;
  audio.currentTime = Math.min(duration, Math.max(0, seekTo));
  onSeekHandled();
 }, [duration, onSeekHandled, seekTo]);

 useEffect(() => {
  if (audioRef.current) {
   audioRef.current.playbackRate = playbackRate;
  }
 }, [playbackRate]);

 useEffect(() => {
  if (audioRef.current) {
   audioRef.current.volume = isMuted ? 0 : volume;
  }
 }, [volume, isMuted]);

 const handleSkip = (seconds: number) => {
  const nextTime = Math.min(duration, Math.max(0, currentTime + seconds));
  onSeek(nextTime);
 };

 const speechMarkers = useMemo(() => {
  return segments.map((segment) => {
   const leftPercent = (segment.start_time / duration) * 100;
   const widthPercent = ((segment.end_time - segment.start_time) / duration) * 100;
   return { id: segment.id, leftPercent, widthPercent };
  });
 }, [duration, segments]);

 const livelyIntervals = useMemo(() => {
  if (segments.length < 4 || duration === 0) return [];
  const intervals: { start: number; end: number; speakers: string[] }[] = [];
  const WINDOW_SIZE = 15;
  const MIN_SEGMENTS = 4;
  
  let currentStart = 0;
  while (currentStart < duration) {
   const currentEnd = currentStart + WINDOW_SIZE;
   const segsInWindow = segments.filter(s => 
    (s.start_time >= currentStart && s.start_time < currentEnd) ||
    (s.end_time > currentStart && s.end_time <= currentEnd)
   );
   
   if (segsInWindow.length >= MIN_SEGMENTS) {
    const uniqueSpeakers = new Set(segsInWindow.map(s => s.speaker_id));
    if (uniqueSpeakers.size > 1) {
     intervals.push({ start: currentStart, end: currentEnd, speakers: Array.from(uniqueSpeakers) });
    }
   }
   currentStart += 5;
  }
  
  const merged: { start: number; end: number; speakers: string[] }[] = [];
  intervals.forEach(int => {
   if (merged.length === 0) {
    merged.push(int);
   } else {
    const last = merged[merged.length - 1];
    if (int.start <= last.end) {
     last.end = Math.max(last.end, int.end);
     int.speakers.forEach(s => {
      if (!last.speakers.includes(s)) last.speakers.push(s);
     });
    } else {
     merged.push(int);
    }
   }
  });
  
  return merged.map((int, i) => {
   const leftPercent = (int.start / duration) * 100;
   const widthPercent = ((int.end - int.start) / duration) * 100;
   const speakerNames = int.speakers.map(sid => speakersById?.[sid]?.speakers_name || sid).join(", ");
   return { ...int, id: `lively-${i}`, leftPercent, widthPercent, tooltipText: speakerNames };
  });
 }, [segments, duration, speakersById]);

 return (
  <div className="relative w-full rounded-[20px] border dark:border-white/10 border-gray-200 dark:bg-white/[0.04] bg-white/70 backdrop-blur-xl p-3 shadow-md overflow-visible">
   <audio
    ref={audioRef}
    src={audioUrl}
    preload="metadata"
    onEnded={onEnded}
    onTimeUpdate={(event) => {
     onTimeUpdate(event.currentTarget.currentTime);
    }}
   />

   {/* Top Timeline Track (YouTube-Style Progress Bar) */}
   <div className="relative mb-3 px-1">
    <div
     className="group relative h-[8px] w-full rounded-full cursor-pointer transition-all duration-300 hover:h-[10px]"
     onClick={(event) => {
      const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      onSeek(ratio * duration);
     }}
     onMouseMove={(event) => {
      const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const hoverPercent = ratio * 100;
      const hovered = livelyIntervals.find(l => hoverPercent >= l.leftPercent && hoverPercent <= l.leftPercent + l.widthPercent);
      setHoveredLivelyId(hovered ? hovered.id : null);
     }}
     onMouseLeave={() => setHoveredLivelyId(null)}
    >
     {/* Clipped Base Track, Played Progress Fill & Highlight Hotspots (100% Rounded & Contained on Both Left & Right Ends) */}
     <div className="absolute inset-0 rounded-full overflow-hidden dark:bg-white/15 bg-gray-300/50">
      {/* Base Played Progress Fill */}
      <span
       className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#4f46e5] to-[#0284c7] z-10 pointer-events-none shadow-[0_0_10px_rgba(124,58,237,0.5)]"
       style={{ width: `${progressPercent}%` }}
      />

      {/* Lively Discussion Hotspots (100% Clipped inside Track Bounds on Both Ends) */}
      {livelyIntervals.map((lively) => (
       <div
        key={lively.id}
        className={`absolute top-0 bottom-0 rounded-full transition-all z-20 pointer-events-none ${
         hoveredLivelyId === lively.id
          ? 'bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,1)]'
          : 'bg-cyan-400/90 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
        }`}
        style={{
         left: `${lively.leftPercent}%`,
         width: `${Math.max(lively.widthPercent, 1.5)}%`,
        }}
       />
      ))}
     </div>

     {/* Floating Tooltips for Hotspots */}
     {livelyIntervals.map((lively) => (
      <div
       key={`tooltip-${lively.id}`}
       className="absolute top-0 bottom-0 pointer-events-none z-30"
       style={{
        left: `${lively.leftPercent}%`,
        width: `${Math.max(lively.widthPercent, 1.5)}%`,
       }}
      >
       <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 ${hoveredLivelyId === lively.id ? 'flex' : 'hidden'} flex-col items-center z-[100] pointer-events-none transition-all duration-300 animate-scale-up`}>
        <div className="flex items-center gap-2 rounded-2xl dark:bg-[#121212]/95 bg-white/95 backdrop-blur-xl border dark:border-white/20 border-purple-300/80 px-3.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
         <span className="text-cyan-400 text-[15px] animate-pulse">🔥</span>
         <div className="flex flex-col text-left">
          <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">THẢO LUẬN SÔI NỔI</span>
          <span className="text-[12px] font-semibold dark:text-white text-gray-900 whitespace-nowrap">{lively.tooltipText}</span>
         </div>
        </div>
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-purple-300/80 dark:border-t-white/20 mt-[-1px]" />
       </div>
      </div>
     ))}

     {/* Transparent Glass Seeker Handle (Nút kéo timeline trong suốt thủy tinh rực rỡ - z-50) */}
     <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 pointer-events-none transition-transform duration-200 group-hover:scale-125"
      style={{ left: `${progressPercent}%` }}
     >
      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/20 dark:bg-white/15 border-2 border-white backdrop-blur-md shadow-[0_0_12px_rgba(255,255,255,0.9),_0_0_8px_rgba(140,0,255,0.8)]">
       <div className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,1)] animate-pulse" />
      </div>
     </div>

     {/* Interactive Range Input */}
     <input
      type="range"
      min={0}
      max={duration}
      step={0.1}
      value={displayTime}
      onChange={(event) => {
       const val = Number(event.target.value);
       setDragValue(val);
       onTimeUpdate(val);
      }}
      onMouseUp={() => {
       if (dragValue !== null) {
        onSeek(dragValue);
        setDragValue(null);
       }
      }}
      onTouchEnd={() => {
       if (dragValue !== null) {
        onSeek(dragValue);
        setDragValue(null);
       }
      }}
      className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 z-40"
      aria-label="Timeline"
     />
    </div>
   </div>

   {/* Bottom Playback Controls Bar */}
   <div className="flex items-center justify-between gap-4">
    {/* Left: Time display badges */}
    <div className="flex items-center gap-2">
     <div className="flex items-center gap-1.5 rounded-full dark:bg-white/10 bg-purple-50 px-3.5 py-1.5 border dark:border-white/10 border-purple-200 shadow-sm">
      <span className="text-[13px] font-mono font-extrabold text-purple-600 dark:text-cyan-400">
       {formatTime(displayTime)}
      </span>
      <span className="text-[12px] dark:text-gray-500 text-gray-400">/</span>
      <span className="text-[13px] font-mono font-semibold dark:text-gray-400 text-gray-600">
       {formatTime(duration)}
      </span>
     </div>
    </div>

    {/* Center: Play/Pause & Skip -10s / +10s Controls */}
    <div className="flex items-center gap-4 px-1">
     <button
      type="button"
      onClick={() => handleSkip(-10)}
      className="flex h-9 w-9 items-center justify-center rounded-full dark:bg-white/5 bg-gray-100 dark:text-gray-300 text-gray-700 transition-all hover:scale-105 hover:dark:bg-white/10 hover:bg-gray-200 active:scale-95 shrink-0"
      aria-label="Skip back 10 seconds"
      title="Lùi 10 giây"
     >
      <RotateCcw className="h-4 w-4" />
     </button>

     {/* Transparent Glass Play/Pause Button (100% Perfectly Rounded Glow Circle) */}
     <div className="mx-2.5 shrink-0 relative flex items-center justify-center p-1 overflow-visible">
      <button
       type="button"
       onClick={onTogglePlay}
       className="group relative flex h-11 w-11 items-center justify-center rounded-full dark:bg-white/5 bg-gray-100 dark:text-gray-200 text-gray-700 border dark:border-white/15 border-purple-200/80 transition-all duration-300 hover:scale-105 hover:border-transparent active:scale-95 focus-visible:outline-none overflow-hidden"
       aria-label={isPlaying ? "Pause" : "Play"}
      >
       {/* Brand Purple-Cyan Hover Gradient Background Circle */}
       <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8c00ff] via-[#6366f1] to-[#0aa9f5] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(140,0,255,0.6)]" />

       {/* Icon */}
       <div className="relative z-10 text-current group-hover:text-white transition-colors duration-300">
        {isPlaying ? (
         <PauseIcon className="h-5 w-5 fill-current" />
        ) : (
         <PlayTriangleIcon className="h-6 w-6 fill-current ml-0.5" />
        )}
       </div>
      </button>
     </div>

     <button
      type="button"
      onClick={() => handleSkip(10)}
      className="flex h-9 w-9 items-center justify-center rounded-full dark:bg-white/5 bg-gray-100 dark:text-gray-300 text-gray-700 transition-all hover:scale-105 hover:dark:bg-white/10 hover:bg-gray-200 active:scale-95 shrink-0"
      aria-label="Skip forward 10 seconds"
      title="Tới 10 giây"
     >
      <RotateCw className="h-4 w-4" />
     </button>
    </div>

    {/* Right: Speed selector & Volume controls */}
    <div className="flex items-center gap-3">
     {/* Speed Menu */}
     <div className="relative">
      <button
       type="button"
       onClick={() => setShowSpeedMenu(!showSpeedMenu)}
       className="flex items-center gap-1.5 rounded-full dark:bg-white/10 bg-purple-50 px-3 py-1.5 text-[12px] font-bold text-purple-600 dark:text-cyan-400 border dark:border-white/10 border-purple-200 transition-all hover:scale-105"
      >
       <Gauge className="h-3.5 w-3.5" />
       <span>{playbackRate}x</span>
      </button>

      {showSpeedMenu && (
       <div className="absolute right-0 bottom-full mb-2 z-50 flex flex-col overflow-hidden rounded-xl border dark:border-white/15 border-purple-200 dark:bg-[#181818] bg-white shadow-2xl backdrop-blur-xl">
        {SPEED_OPTIONS.map((rate) => (
         <button
          key={rate}
          type="button"
          onClick={() => {
           setPlaybackRate(rate);
           setShowSpeedMenu(false);
          }}
          className={`px-4 py-1.5 text-left text-[12px] font-bold transition-colors ${
           rate === playbackRate
            ? 'bg-purple-500/20 text-purple-400'
            : 'dark:text-gray-300 text-gray-700 hover:dark:bg-white/10 hover:bg-gray-100'
          }`}
         >
          {rate}x
         </button>
        ))}
       </div>
      )}
     </div>

     {/* Volume Controls */}
     <div className="flex items-center gap-2 group/vol">
      <button
       type="button"
       onClick={() => setIsMuted(!isMuted)}
       className="dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors"
       aria-label={isMuted ? "Unmute" : "Mute"}
      >
       {isMuted || volume === 0 ? (
        <VolumeX className="h-4 w-4 text-red-400" />
       ) : (
        <Volume2 className="h-4 w-4" />
       )}
      </button>
      <input
       type="range"
       min={0}
       max={1}
       step={0.05}
       value={isMuted ? 0 : volume}
       onChange={(e) => {
        setVolume(Number(e.target.value));
        if (isMuted) setIsMuted(false);
       }}
       className="w-16 h-1.5 rounded-full cursor-pointer appearance-none dark:bg-white/20 bg-gray-300 accent-purple-500"
       aria-label="Volume"
      />
     </div>
    </div>
   </div>
  </div>
 );
}
