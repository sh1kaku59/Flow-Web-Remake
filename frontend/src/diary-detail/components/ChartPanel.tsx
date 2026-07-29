import { useEffect, useMemo, useState } from "react";
import type { ChartAnalyticsData, IntensityPoint, SpeakerStat, TopicTransition } from "../types";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface ChartPanelProps {
 isOpen: boolean;
 onClose: () => void;
 data: ChartAnalyticsData | null;
}

// ─── SVG / Icon helpers ───────────────────────────────────────────────────────

function XIcon({ className }: { className?: string }) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
   <path d="M18 6L6 18M6 6L18 18" />
  </svg>
 );
}

function CycleIcon({ className, color }: { className?: string; color?: string }) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? { color } : undefined}>
   <path d="M21 2v6h-6" />
   <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
   <path d="M3 22v-6h6" />
   <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
 );
}

function MicIcon({ className, color }: { className?: string; color?: string }) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? { color } : undefined}>
   <rect x="9" y="2" width="6" height="11" rx="3" />
   <path d="M5 10a7 7 0 0 0 14 0" />
   <line x1="12" y1="19" x2="12" y2="22" />
   <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
 );
}

function HashIcon({ className, color }: { className?: string; color?: string }) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className={className} style={color ? { color } : undefined}>
   <line x1="4" y1="9" x2="20" y2="9" />
   <line x1="4" y1="15" x2="20" y2="15" />
   <line x1="10" y1="3" x2="8" y2="21" />
   <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
 );
}

function ChatIcon({ className, color }: { className?: string; color?: string }) {
 return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} style={color ? { color } : undefined}>
   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
   <line x1="9" y1="10" x2="9.01" y2="10" strokeWidth={3} />
   <line x1="12" y1="10" x2="12.01" y2="10" strokeWidth={3} />
   <line x1="15" y1="10" x2="15.01" y2="10" strokeWidth={3} />
  </svg>
 );
}

function SparkleIcon({ className }: { className?: string }) {
 return (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
   <circle cx="12" cy="12" r="2.5" />
   <circle cx="12" cy="3" r="1.5" />
   <circle cx="12" cy="21" r="1.5" />
   <circle cx="3" cy="12" r="1.5" />
   <circle cx="21" cy="12" r="1.5" />
   <circle cx="5.6" cy="5.6" r="1.5" />
   <circle cx="18.4" cy="18.4" r="1.5" />
   <circle cx="18.4" cy="5.6" r="1.5" />
   <circle cx="5.6" cy="18.4" r="1.5" />
  </svg>
 );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
 const rad = ((angleDeg - 90) * Math.PI) / 180;
 return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcSegmentPath(
 cx: number, cy: number, r: number,
 startPct: number, endPct: number
): string {
 const startDeg = startPct * 3.6;
 const endDeg = endPct * 3.6;
 const s = polarToCartesian(cx, cy, r, startDeg);
 const e = polarToCartesian(cx, cy, r, endDeg);
 const large = endDeg - startDeg > 180 ? 1 : 0;
 return `M ${s.x.toFixed(2)},${s.y.toFixed(2)} A ${r},${r} 0 ${large},1 ${e.x.toFixed(2)},${e.y.toFixed(2)}`;
}

function DonutChart({ speakers, totalLabel }: { speakers: SpeakerStat[]; totalLabel: string }) {
 const [hoveredId, setHoveredId] = useState<string | null>(null);

 const SIZE = 170;
 const cx = 85, cy = 85;
 const r = 58;
 const strokeWidth = 22;
 const GAP = 0.5;

 let cumulative = 0;
 const segments = speakers.map((s) => {
  const start = cumulative + GAP;
  const end = cumulative + s.percentage - GAP;
  cumulative += s.percentage;
  return { ...s, start, end };
 });

 const hoveredSpeaker = speakers.find((s) => s.id === hoveredId);

 return (
  <div className="flex items-center gap-[20px]">
   <div className="relative flex-shrink-0">
    <svg
     width={SIZE}
     height={SIZE}
     viewBox={`0 0 ${SIZE} ${SIZE}`}
     aria-hidden="true"
    >
     <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" className="dark:text-white/10 text-gray-200" strokeWidth={strokeWidth} />

     {segments.map((seg) => {
      const isHovered = hoveredId === seg.id;
      return (
       <path
        key={seg.id}
        d={arcSegmentPath(cx, cy, r, seg.start, seg.end)}
        fill="none"
        stroke={seg.color}
        strokeWidth={isHovered ? strokeWidth + 5 : strokeWidth}
        strokeLinecap="butt"
        className="transition-all duration-300 cursor-pointer"
        style={{
         filter: isHovered ? `drop-shadow(0 0 10px ${seg.color})` : "none",
         opacity: hoveredId && !isHovered ? 0.45 : 1,
        }}
        onMouseEnter={() => setHoveredId(seg.id)}
        onMouseLeave={() => setHoveredId(null)}
       />
      );
     })}

     <circle cx={cx} cy={cy} r={r - strokeWidth / 2 - 1} fill="transparent" />

     <text x={cx} y={cy - 12} textAnchor="middle" fontSize={10} fill="#888" fontFamily="inherit">
      {hoveredSpeaker ? hoveredSpeaker.name : "Total"}
     </text>
     <text x={cx} y={cy + 7} textAnchor="middle" fontSize={18} fontWeight="bold" fill="currentColor" className="dark:fill-white fill-gray-900 transition-all duration-300" fontFamily="inherit">
      {hoveredSpeaker ? `${hoveredSpeaker.percentage.toFixed(1)}%` : totalLabel}
     </text>
     <text x={cx} y={cy + 22} textAnchor="middle" fontSize={10} fill="#888" fontFamily="inherit">
      {hoveredSpeaker ? hoveredSpeaker.speakingTimeFormatted : "min"}
     </text>
    </svg>
   </div>

   <div className="flex flex-col gap-[12px] flex-1">
    {speakers.map((s) => {
     const isHovered = hoveredId === s.id;
     return (
      <div
       key={s.id}
       onMouseEnter={() => setHoveredId(s.id)}
       onMouseLeave={() => setHoveredId(null)}
       className={`flex items-center gap-[8px] p-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
        isHovered ? "dark:bg-white/10 bg-purple-500/10 scale-[1.02]" : "hover:dark:bg-white/5 hover:bg-gray-100"
       }`}
      >
       <span
        className={`h-[10px] w-[10px] flex-shrink-0 rounded-full transition-transform duration-300 ${isHovered ? "scale-125" : ""}`}
        style={{ backgroundColor: s.color, boxShadow: isHovered ? `0 0 8px ${s.color}` : "none" }}
       />
       <span className="w-[76px] text-[13px] font-semibold dark:text-gray-300 text-gray-700 truncate">{s.name}</span>
       <span className="w-[38px] text-[13px] font-semibold dark:text-gray-200 text-gray-900">{s.speakingTimeFormatted}</span>
       <span className="text-[13px] font-extrabold ml-auto" style={{ color: s.color }}>
        {s.percentage.toFixed(1)}%
       </span>
      </div>
     );
    })}
   </div>
  </div>
 );
}

// ─── Participation Bars ───────────────────────────────────────────────────────

function ParticipationBars({ speakers, turnsText }: { speakers: SpeakerStat[]; turnsText: string }) {
 const [hoveredId, setHoveredId] = useState<string | null>(null);
 const maxTurns = Math.max(...speakers.map((s) => s.turns));
 const totalTurns = speakers.reduce((acc, s) => acc + s.turns, 0);

 return (
  <div className="flex flex-col gap-[14px]">
   {speakers.map((s) => {
    const widthPct = (s.turns / maxTurns) * 100;
    const sharePct = ((s.turns / (totalTurns || 1)) * 100).toFixed(1);
    const isHovered = hoveredId === s.id;

    return (
     <div
      key={s.id}
      onMouseEnter={() => setHoveredId(s.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
       isHovered ? "dark:bg-white/10 bg-purple-50 scale-[1.02] shadow-sm" : ""
      }`}
     >
      <div className="flex items-center justify-between mb-[6px]">
       <span className="text-[13px] font-bold dark:text-gray-200 text-gray-800">{s.name}</span>
       {isHovered && (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full dark:bg-white/10 bg-purple-100 text-purple-600 dark:text-purple-300 animate-fade-in">
         {sharePct}% lượt nói
        </span>
       )}
      </div>

      <div className="flex items-center gap-[10px]">
       <div className="relative h-[12px] flex-1 overflow-hidden rounded-full dark:bg-white/10 bg-gray-200">
        <div
         className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
          isHovered ? "brightness-125 shadow-[0_0_12px_currentColor]" : ""
         }`}
         style={{
          width: `${widthPct}%`,
          backgroundColor: s.color,
         }}
        />
       </div>
       <span
        className={`w-[74px] flex-shrink-0 text-right text-[13px] font-bold transition-colors duration-200 ${
         isHovered ? "text-purple-600 dark:text-cyan-400" : "dark:text-gray-400 text-gray-600"
        }`}
       >
        {s.turns} {turnsText}
       </span>
      </div>
     </div>
    );
   })}
  </div>
 );
}

// ─── Topic Timeline ───────────────────────────────────────────────────────────

function TopicTimeline({ topics }: { topics: TopicTransition[] }) {
 const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

 const totalCalculatedPct = useMemo(() => {
  if (topics.length === 0) return [];
  
  const rawPercentages = topics.map((t, idx) => {
   if (typeof t.percentage === "number" && t.percentage > 0) {
    return t.percentage;
   }
   if (typeof t.start === "number" && typeof t.end === "number" && t.end > t.start) {
    return t.end - t.start;
   }
   const currentPos = t.positionPercent || 0;
   const nextPos = topics[idx + 1] ? topics[idx + 1].positionPercent : 100;
   const diff = nextPos - currentPos;
   return diff > 0 ? diff : Math.max(10, Math.floor(100 / topics.length));
  });

  const sum = rawPercentages.reduce((a, b) => a + b, 0) || 1;
  return rawPercentages.map((val) => Math.max(3, Math.round((val / sum) * 100)));
 }, [topics]);

 return (
  <div className="w-full flex flex-col gap-4 py-1">
   <div className="w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <div className="min-w-max flex flex-col gap-4 px-2">
     {/* Vertical 100% Proportional Column Bars (Stretched to fill card depth) */}
     <div className="flex items-end gap-5 h-[185px] md:h-[200px] px-4 pt-6 pb-2 rounded-2xl border dark:border-white/10 border-gray-200/60 dark:bg-white/[0.02] bg-gray-50/50 relative">
      {topics.map((topic, index) => {
       const pct = totalCalculatedPct[index] || 15;
       const barHeightPct = Math.max(12, Math.min(100, pct));
       const isHovered = hoveredIndex === index;

       return (
        <div
         key={`${topic.label}-${index}`}
         onMouseEnter={() => setHoveredIndex(index)}
         onMouseLeave={() => setHoveredIndex(null)}
         className="relative min-w-[130px] md:min-w-[150px] flex-1 flex flex-col items-center justify-end h-full group/bar cursor-pointer"
        >
         {/* Percentage Label on Top */}
         <span
          className={`mb-1.5 text-[12px] font-black transition-all duration-300 ${
           isHovered ? "scale-125 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-gray-700 dark:text-gray-300"
          }`}
         >
          {pct}%
         </span>

         {/* Vertical Column Bar */}
         <div className="w-full max-w-[64px] h-full flex items-end justify-center rounded-xl bg-gray-200/60 dark:bg-white/10 p-1 overflow-hidden shadow-inner">
          <div
           className={`w-full rounded-lg transition-all duration-500 ${
            isHovered ? "brightness-125 shadow-[0_0_20px_currentColor] scale-[1.05]" : "opacity-90"
           }`}
           style={{
            height: `${barHeightPct}%`,
            backgroundColor: topic.colorHex,
           }}
          />
         </div>
        </div>
       );
      })}
     </div>

     {/* Topic Timeline Line & Spaced Out Center Pills */}
     <div className="relative">
      {/* Topic Pills */}
      <div className="flex gap-5 px-4 mb-3">
       {topics.map((topic, index) => {
        const isHovered = hoveredIndex === index;
        return (
         <div
          key={`${topic.label}-pill-${index}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={`min-w-[130px] md:min-w-[150px] flex-1 flex justify-center cursor-pointer transition-all duration-300 ${
           isHovered ? "scale-105 z-10" : ""
          }`}
         >
          <div
           className={`w-full rounded-xl border-2 px-3 py-1.5 text-center text-[12px] font-extrabold leading-snug truncate transition-all duration-300 shadow-sm ${
            isHovered ? "shadow-lg ring-2 ring-purple-500/50" : ""
           }`}
           style={{
            borderColor: topic.colorHex,
            backgroundColor: topic.bgColorHex,
            color: topic.colorHex,
           }}
          >
           {topic.label}
          </div>
         </div>
        );
       })}
      </div>

      {/* Gradient Timeline Bar & Perfectly Centered Dots */}
      <div className="relative my-3">
       <div
        className="h-[6px] w-full rounded-full shadow-inner"
        style={{
         background: `linear-gradient(to right, ${topics.map((t) => t.colorHex).join(", ")})`,
        }}
       />

       {/* Centered Dots matching exact column grid */}
       <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex gap-5 px-4">
        {topics.map((topic, index) => {
         const isHovered = hoveredIndex === index;
         return (
          <div
           key={`${topic.label}-dot-${index}`}
           onMouseEnter={() => setHoveredIndex(index)}
           onMouseLeave={() => setHoveredIndex(null)}
           className="min-w-[130px] md:min-w-[150px] flex-1 flex items-center justify-center cursor-pointer"
          >
           <div
            className={`rounded-full transition-all duration-300 ${
             isHovered
              ? "h-4 w-4 ring-4 ring-purple-500/40 shadow-[0_0_14px_currentColor] scale-125"
              : "h-3 w-3 border-2 border-white dark:border-[#121212] shadow-sm"
            }`}
            style={{ backgroundColor: topic.colorHex }}
           />
          </div>
         );
        })}
       </div>
      </div>

      {/* Time Markers matching exact column grid */}
      <div className="flex gap-5 px-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1.5">
       {topics.map((topic, index) => (
        <div key={`${topic.label}-time-${index}`} className="min-w-[130px] md:min-w-[150px] flex-1 text-center font-mono">
         {topic.startTimeLabel}
        </div>
       ))}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}

// ─── Intensity Area Chart ─────────────────────────────────────────────────────

function createSmoothPath(pts: [number, number][]): string {
 if (pts.length === 0) return "";
 if (pts.length === 1) return `M ${pts[0][0]},${pts[0][1]}`;

 let d = `M ${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
 for (let i = 1; i < pts.length; i++) {
  const p0 = pts[i - 1];
  const p1 = pts[i];
  const cpx = ((p0[0] + p1[0]) / 2).toFixed(2);
  d += ` C ${cpx},${p0[1].toFixed(2)} ${cpx},${p1[1].toFixed(2)} ${p1[0].toFixed(2)},${p1[1].toFixed(2)}`;
 }
 return d;
}

function IntensityAreaChart({
 points,
 peakLabel,
}: {
 points: IntensityPoint[];
 peakLabel: string;
}) {
 const [hoveredPoint, setHoveredPoint] = useState<IntensityPoint | null>(null);

 const VW = 300, VH = 160;
 const padL = 32, padB = 28, padT = 10, padR = 8;
 const cW = VW - padL - padR;
 const cH = VH - padB - padT;

 const maxTime = points[points.length - 1].timeSec;
 const toX = (t: number) => padL + (t / maxTime) * cW;
 const toY = (v: number) => padT + cH - (v / 100) * cH;
 const bottom = padT + cH;

 const pts = useMemo(
  () => points.map((p): [number, number] => [toX(p.timeSec), toY(p.value)]),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [points]
 );

 const linePath = createSmoothPath(pts);
 const areaPath = `${linePath} L ${pts[pts.length - 1][0].toFixed(2)},${bottom} L ${pts[0][0].toFixed(2)},${bottom} Z`;

 const peakPoint = points.reduce((a, b) => (a.value >= b.value ? a : b));
 const px = toX(peakPoint.timeSec);
 const py = toY(peakPoint.value);

 const xLabels = points.filter((_, i) => i === 0 || i === points.length - 1 || i % 2 === 0);

 const activePoint = hoveredPoint || peakPoint;
 const hx = toX(activePoint.timeSec);
 const hy = toY(activePoint.value);

 return (
  <div className="relative">
   <div className="mb-[4px] flex items-center justify-between">
    <span className="text-[11px] font-bold text-purple-500 dark:text-cyan-400">
     {hoveredPoint ? `Thời điểm: ${hoveredPoint.timeLabel} (${hoveredPoint.value}% sôi nổi)` : "Mức độ thảo luận realtime"}
    </span>
    <span className="rounded-full border border-[#c084fc] px-[10px] py-[2px] text-[11px] font-semibold text-[#a855f7]">
     Peak at {peakLabel}
    </span>
   </div>

   <div className="relative">
    <svg
     viewBox={`0 0 ${VW} ${VH}`}
     className="w-full cursor-crosshair"
     aria-label="Discussion intensity over time"
     onMouseLeave={() => setHoveredPoint(null)}
     onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * VW;
      let closest = points[0];
      let minDiff = Math.abs(toX(closest.timeSec) - mouseX);
      for (const p of points) {
       const diff = Math.abs(toX(p.timeSec) - mouseX);
       if (diff < minDiff) {
        minDiff = diff;
        closest = p;
       }
      }
      setHoveredPoint(closest);
     }}
    >
     <defs>
      <linearGradient id="intensityFill" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0%" stopColor="#7C6AE8" stopOpacity="0.45" />
       <stop offset="100%" stopColor="#7C6AE8" stopOpacity="0.04" />
      </linearGradient>
     </defs>

     <text
      x={10} y={padT + cH / 2}
      textAnchor="middle"
      fontSize={8}
      fill="#bbb"
      fontFamily="inherit"
      transform={`rotate(-90, 10, ${padT + cH / 2})`}
     >
      Intensity
     </text>

     {[25, 50, 75].map((v) => (
      <line
       key={v}
       x1={padL} y1={toY(v)}
       x2={padL + cW} y2={toY(v)}
       stroke="rgba(150,150,150,0.2)"
       strokeWidth={0.8}
       strokeDasharray="3 3"
      />
     ))}

     <path d={areaPath} fill="url(#intensityFill)" />
     <path d={linePath} fill="none" stroke="#7C6AE8" strokeWidth={2} strokeLinejoin="round" />
     
     {/* Vertical Crosshair Guide Line */}
     {hoveredPoint && (
      <line x1={hx} y1={padT} x2={hx} y2={bottom} stroke="#0aa9f5" strokeWidth={1} strokeDasharray="2 2" />
     )}

     {/* Hover Halo Point */}
     <circle cx={hx} cy={hy} r={6} fill="#0aa9f5" stroke="white" strokeWidth={2} className="animate-pulse" />
     <circle cx={px} cy={py} r={4} fill="#7C6AE8" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} />
     
     <line x1={padL} y1={bottom} x2={padL + cW} y2={bottom} stroke="rgba(150,150,150,0.3)" strokeWidth={1} />

     {xLabels.map((p) => (
      <text
       key={p.timeSec}
       x={toX(p.timeSec)}
       y={VH - 6}
       textAnchor="middle"
       fontSize={8}
       fill="#bbb"
       fontFamily="inherit"
      >
       {p.timeLabel}
      </text>
     ))}
    </svg>
   </div>
  </div>
 );
}

// ─── Analytics Card Wrapper ───────────────────────────────────────────────────

interface AnalyticsCardProps {
 icon: React.ReactNode;
 title: string;
 titleColor: string;
 children: React.ReactNode;
 headerRight?: React.ReactNode;
}

function AnalyticsCard({ icon, title, titleColor, children, headerRight }: AnalyticsCardProps) {
 return (
  <div className="group flex flex-col rounded-[20px] dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 p-[20px] shadow-sm transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_12px_35px_rgba(140,0,255,0.15)] hover:border-purple-500/40">
   <div className="mb-[16px] flex items-center justify-between">
    <div className="flex items-center gap-[8px]">
     {icon}
     <span className="text-[15px] font-extrabold tracking-tight" style={{ color: titleColor }}>
      {title}
     </span>
    </div>
    {headerRight}
   </div>

   {children}
  </div>
 );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function ChartPanel({ isOpen, onClose, data }: ChartPanelProps) {
 const { t } = useLanguage();

 useEffect(() => {
  if (!isOpen) return;
  const handler = (e: KeyboardEvent) => {
   if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
 }, [isOpen, onClose]);

 return (
  <>
   {/* Backdrop */}
   <div
    className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
     isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
    style={{ top: "72px" }}
    onClick={onClose}
    aria-hidden="true"
   />

   {/* Panel */}
   <div
    className={`fixed right-0 bottom-0 z-50 flex w-full max-w-[980px] flex-col overflow-hidden dark:bg-[#111] bg-white border-l dark:border-white/10 border-gray-200 shadow-2xl transition-transform duration-300 ease-out ${
     isOpen ? "translate-x-0" : "translate-x-full"
    }`}
    style={{ top: "72px" }}
    role="dialog"
    aria-modal="true"
    aria-label="Speaker Behavior Analysis"
   >
    {/* Sticky header */}
    <div className="flex flex-shrink-0 items-center justify-between border-b dark:border-white/10 border-gray-200 dark:bg-[#111]/80 bg-white/90 backdrop-blur-md px-[36px] py-[24px]">
     <h2 className="text-[28px] font-extrabold tracking-[-0.3px] dark:text-white text-gray-900">
      {t("chart_analysis_title")}
     </h2>
     <button
      type="button"
      onClick={onClose}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] dark:text-gray-400 text-gray-500 transition-all duration-200 hover:dark:bg-white/10 hover:bg-gray-100 hover:dark:text-white hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
      aria-label="Close chart"
     >
      <XIcon className="h-[22px] w-[22px]" />
     </button>
    </div>

    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto px-[28px] pb-[36px] pt-[20px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
     {data ? (
      <>
       <div className="grid grid-cols-2 gap-[16px]">
        {/* [TL] Speaking Time Distribution */}
        <AnalyticsCard
         icon={<CycleIcon className="h-[20px] w-[20px]" color="#13b9ef" />}
         title={t("chart_speaking_time")}
         titleColor="#13b9ef"
        >
         <DonutChart speakers={data.speakers} totalLabel={data.totalDurationLabel} />
        </AnalyticsCard>

        {/* [TR] Participation Frequency */}
        <AnalyticsCard
         icon={<MicIcon className="h-[20px] w-[20px]" color="#22c55e" />}
         title={t("chart_participation_freq")}
         titleColor="#22c55e"
        >
         <ParticipationBars speakers={data.speakers} turnsText={t("turns")} />
        </AnalyticsCard>

        {/* [BL] Topic Transition Indicators */}
        <AnalyticsCard
         icon={<HashIcon className="h-[20px] w-[20px]" color="#f97316" />}
         title={t("chart_topic_transition")}
         titleColor="#f97316"
        >
         <TopicTimeline topics={data.topics} />
        </AnalyticsCard>

        {/* [BR] Discussion Intensity */}
        <AnalyticsCard
         icon={<ChatIcon className="h-[20px] w-[20px]" color="#d946ef" />}
         title={t("chart_discussion_intensity")}
         titleColor="#d946ef"
        >
         <IntensityAreaChart points={data.intensityPoints} peakLabel={data.peakTimeLabel} />
        </AnalyticsCard>
       </div>

       {/* Insights row */}
       <div className="mt-[20px] flex items-start gap-[14px] rounded-[16px] border border-purple-500/30 bg-purple-500/10 px-[22px] py-[18px] transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/15">
        <SparkleIcon className="mt-[2px] h-[32px] w-[32px] flex-shrink-0 text-purple-400 animate-pulse" />
        <div>
         <p className="mb-[6px] text-[15px] font-extrabold text-purple-400">{t("chart_insights")}</p>
         <p className="text-[14px] leading-[1.65] font-medium dark:text-gray-300 text-gray-700">{data.insightText}</p>
        </div>
       </div>
      </>
     ) : (
      <div className="flex h-[300px] items-center justify-center text-[16px] font-medium dark:text-gray-500 text-gray-400">
       {t("no_analytics_available")}
      </div>
     )}
    </div>
   </div>
  </>
 );
}
