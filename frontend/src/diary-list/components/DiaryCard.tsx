import { Meeting, MeetingStatus } from "../types";
import { formatDate, formatDuration } from "../utils";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface DiaryCardProps {
 meeting: Meeting;
 onRename: (meeting: Meeting) => void;
 onOpenDetail: (meetingId: string) => void;
}

const STATUS_STYLES: Record<
 MeetingStatus,
 {
  cardBackground: string;
  text: string;
 }
> = {
 Pending: {
  cardBackground:
   "bg-[linear-gradient(114deg,#ab8af5_0%,#a12ef3_48%,#861fdd_100%)]",
  text: "text-[#ffffff]",
 },
 Processing: {
  cardBackground:
   "bg-[linear-gradient(112deg,#7fb9e7_0%,#3697d4_55%,#14b1e0_100%)]",
  text: "text-[#ffffff]",
 },
 Completed: {
  cardBackground:
   "bg-[linear-gradient(112deg,#40d856_0%,#30c14b_55%,#28b544_100%)]",
  text: "text-[#ffffff]",
 },
 Failed: {
  cardBackground:
   "bg-[linear-gradient(112deg,#ef967f_0%,#ef8579_58%,#ee8174_100%)]",
  text: "text-[#ffffff]",
 },
};

export function DiaryCard({ meeting, onRename, onOpenDetail }: DiaryCardProps) {
 const { t } = useLanguage();
 const style = STATUS_STYLES[meeting.status];

 return (
  <article
   role="button"
   tabIndex={0}
   onClick={() => onOpenDetail(meeting.id)}
   onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
     event.preventDefault();
     onOpenDetail(meeting.id);
    }
   }}
   className={`relative flex flex-col h-full min-h-[110px] cursor-pointer overflow-hidden rounded-[20px] px-[16px] py-[16px] md:px-[24px] md:py-[20px]
    shadow-[0_6px_18px_rgba(0,0,0,0.15)]
    transition-all duration-200 will-change-transform
    hover:scale-[1.02]
    hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]
    active:scale-[0.99]
    ${style.cardBackground} ${style.text}`
   }
  >
   <div className="relative z-10 w-full h-full flex flex-col justify-between min-h-0">
    
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
     <div className="flex items-start justify-between">
      <div className="flex items-start gap-[6px] min-w-0 pr-2">
       <h3 className="text-[18px] md:text-[22px] font-semibold tracking-[0.2px] leading-[1.3] line-clamp-2 break-words">
        {meeting.title}
       </h3>
       <button
        type="button"
        onClick={(event) => {
         event.stopPropagation();
         onRename(meeting);
        }}
        className="text-[#474747] transition-opacity hover:opacity-100 flex-shrink-0 mt-[2px]"
        aria-label={`Rename ${meeting.title}`}
       >
        <img
         src="/icons/ic_round-drive-file-rename-outline.svg"
         alt=""
         aria-hidden="true"
         className="h-[18px] w-[18px] object-contain opacity-95"
        />
       </button>
      </div>
     </div>
     
     {meeting.topic && (
       <div className="mt-[6px] md:mt-[8px] w-full flex">
        <span className="inline-block max-w-full rounded-full bg-white/15 px-[10px] py-[4px] text-[12px] font-medium text-white/90 backdrop-blur-md truncate border border-white/20">
         {meeting.topic}
        </span>
       </div>
      )}
    </div>
    
    <div className="flex items-end justify-between mt-[10px] md:mt-[14px] shrink-0 gap-2">
     <div className="flex items-center gap-[8px] md:gap-[12px]">
      <p className="text-[16px] md:text-[18px] leading-none opacity-95 font-semibold">
       {formatDuration(meeting.duration)}
      </p>
      <div className="flex items-center gap-[4px] md:gap-[6px] rounded-full bg-black/20 px-[8px] py-[4px] md:px-[10px] md:py-[6px] text-[11px] md:text-[12px] font-medium text-white/90 backdrop-blur-sm border border-white/10 shadow-sm whitespace-nowrap">
       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
       </svg>
       <span>
        {t("auto_delete_badge")} {(() => {
         const created = new Date(meeting.created_at);
         const now = new Date();
         const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
         const remaining = Math.max(0, 24 - diffHours);
         return `${remaining}h`;
        })()}
       </span>
      </div>
     </div>
     
     <div className="text-right flex flex-col items-end shrink-0">
      <p className="text-[14px] md:text-[17px] font-bold leading-none tracking-wide drop-shadow-sm">{meeting.status}</p>
      <p className="mt-[4px] md:mt-[6px] text-[12px] md:text-[14px] opacity-90 leading-none font-medium">{formatDate(meeting.created_at)}</p>
     </div>
    </div>
   </div>

   <div className="absolute -right-[75px] top-[-70px] h-[170px] w-[165px] rounded-full bg-[#ffffff38] pointer-events-none" />
   <div className="absolute -right-[85px] top-[74px] h-[140px] w-[155px] rounded-full bg-[#ffffff2b] pointer-events-none" />
  </article>
 );
}
