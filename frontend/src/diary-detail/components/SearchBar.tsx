import { ChangeEvent } from "react";
import { useLanguage } from "../../shared/i18n/LanguageContext";
import { Sparkles } from "lucide-react";

interface SearchBarProps {
 value: string;
 onChange: (value: string) => void;
 onChartClick?: () => void;
 onSummaryClick?: () => void;
 onReportClick?: () => void;
}

export function SearchBar({ value, onChange, onChartClick, onSummaryClick, onReportClick }: SearchBarProps) {
 const { t } = useLanguage();

 const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
  onChange(event.target.value);
 };

 return (
  <div className="flex w-full items-center gap-[10px]">
   <div className="relative h-[54px] flex-1 rounded-[27px] p-[2px] overflow-hidden group shadow-[0_0_22px_rgba(140,0,255,0.3)] focus-within:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all duration-300">
    {/* Continuous Seamless Brand Purple-Cyan Glowing Aura Gradient (Loang loáng liên kết 360 độ) */}
    <div className="absolute inset-[-200%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,#8c00ff_0deg,#4f46e5_90deg,#0aa9f5_180deg,#8c00ff_270deg,#0aa9f5_360deg)] opacity-95 group-hover:opacity-100 transition-opacity blur-[0.5px]" />
    
    <div className="relative h-full w-full rounded-[24.5px] dark:bg-gradient-to-r dark:from-[#18122B] dark:via-[#111116] dark:to-[#0F172A] bg-white flex items-center shadow-inner px-4">
     <div className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/20 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.4)] z-10">
      <Sparkles className="h-4.5 w-4.5 text-cyan-300 animate-pulse" />
     </div>
     <input
      type="text"
      value={value}
      onChange={handleInput}
      className="relative h-full w-full bg-transparent pl-[46px] pr-[18px] text-[16px] font-medium dark:text-white text-gray-900 outline-none transition-colors duration-200 placeholder:dark:text-gray-400 placeholder:text-gray-400 rounded-[24.5px] z-10"
      placeholder={t("search_semantic_placeholder")}
     />
    </div>
   </div>

   <button
    type="button"
    onClick={onChartClick}
    className="flex h-[50px] w-[160px] items-center justify-center gap-[10px] rounded-[12px] bg-gradient-to-r from-[#8c00ff] to-[#6c15ff] text-[16px] font-bold text-white shadow-[0_4px_10px_rgba(75,45,166,0.25)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_6px_12px_rgba(75,45,166,0.3)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4b5ff]"
   >
    <img
     src="/icons/solar_chart-bold.svg"
     alt=""
     aria-hidden="true"
     className="h-[22px] w-[22px] object-contain"
    />
    {t("btn_chart")}
   </button>

   <button
    type="button"
    onClick={onSummaryClick}
    className="flex h-[50px] w-[160px] items-center justify-center gap-[10px] rounded-[12px] bg-gradient-to-r from-[#14b8f0] to-[#0aa9f5] text-[16px] font-bold text-white shadow-[0_4px_10px_rgba(14,153,209,0.2)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_6px_12px_rgba(14,153,209,0.26)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9de7ff]"
   >
    <img
     src="/icons/tdesign_summary.svg"
     alt=""
     aria-hidden="true"
     className="h-[22px] w-[22px] object-contain"
    />
    {t("btn_summary")}
   </button>

   <button
    type="button"
    onClick={onReportClick}
    className="flex h-[50px] w-[160px] items-center justify-center gap-[10px] rounded-[12px] bg-gradient-to-r from-[#8c00ff] via-[#3b82f6] to-[#0aa9f5] bg-[length:200%_200%] text-[16px] font-bold text-white shadow-[0_4px_12px_rgba(140,0,255,0.3)] transition-all duration-300 ease-out hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(6,182,212,0.45)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
   >
    <svg className="h-[22px] w-[22px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
     <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
     <polyline points="14 2 14 8 20 8"/>
     <path d="M12 18v-6"/>
     <path d="m9 15 3 3 3-3"/>
    </svg>
    {t("btn_report_pdf")}
   </button>
  </div>
 );
}
