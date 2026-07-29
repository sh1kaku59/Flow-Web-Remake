import { useEffect, useMemo } from "react";
import type { SummaryData, SummarySection } from "../types";
import { useLanguage } from "../../shared/i18n/LanguageContext";
import { Target, Lightbulb, CheckCircle2, ClipboardList, Sparkles, Check, FileText, Users } from "lucide-react";

interface SummaryPanelProps {
 isOpen: boolean;
 onClose: () => void;
 data: SummaryData | null;
}

function XIcon({ className }: { className?: string }) {
 return (
  <svg
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth={2.5}
   strokeLinecap="round"
   strokeLinejoin="round"
   className={className}
  >
   <path d="M18 6L6 18M6 6L18 18" />
  </svg>
 );
}

interface ProcessedSection {
 key: string;
 title: string;
 icon: React.ReactNode;
 badgeColor: string;
 items: string[];
}

export function SummaryPanel({ isOpen, onClose, data }: SummaryPanelProps) {
 const { t } = useLanguage();

 useEffect(() => {
  if (!isOpen) return;
  const handler = (e: KeyboardEvent) => {
   if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
 }, [isOpen, onClose]);

 // Transform raw sections or text into standardized 5-section meeting report structure
 const formattedSections = useMemo<ProcessedSection[]>(() => {
  if (!data) return [];

  // Standard 5 section definitions
  const standardConfig: Record<string, { icon: React.ReactNode; badgeColor: string; fallbackTitle: string }> = {
   overview: {
    icon: <Target className="w-5 h-5 text-purple-400" />,
    badgeColor: "from-purple-600/30 to-indigo-600/30 border-purple-500/40 text-purple-300",
    fallbackTitle: "1. Mục Tiêu & Tổng Quan Cuộc Họp (Overview)",
   },
   speakers: {
    icon: <Users className="w-5 h-5 text-cyan-400" />,
    badgeColor: "from-cyan-600/30 to-blue-600/30 border-cyan-500/40 text-cyan-300",
    fallbackTitle: "2. Tóm Tắt Ý Kiến & Đóng Góp Theo Từng Người Nói",
   },
   discussion: {
    icon: <Lightbulb className="w-5 h-5 text-amber-400" />,
    badgeColor: "from-amber-600/30 to-orange-600/30 border-amber-500/40 text-amber-300",
    fallbackTitle: "3. Các Chủ Đề & Nội Dung Thảo Luận Chính",
   },
   decisions: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    badgeColor: "from-emerald-600/30 to-teal-600/30 border-emerald-500/40 text-emerald-300",
    fallbackTitle: "4. Quyết Định Đã Thống Nhất (Key Decisions)",
   },
   action_items: {
    icon: <ClipboardList className="w-5 h-5 text-indigo-400" />,
    badgeColor: "from-indigo-600/30 to-purple-600/30 border-indigo-500/40 text-indigo-300",
    fallbackTitle: "5. Kế Hoạch & Phân Công Công Việc (Action Items)",
   },
  };

  const keysOrder = ["overview", "speakers", "discussion", "decisions", "action_items"];
  const sectionMap: Record<string, { title: string; items: string[] }> = {
   overview: { title: standardConfig.overview.fallbackTitle, items: [] },
   speakers: { title: standardConfig.speakers.fallbackTitle, items: [] },
   discussion: { title: standardConfig.discussion.fallbackTitle, items: [] },
   decisions: { title: standardConfig.decisions.fallbackTitle, items: [] },
   action_items: { title: standardConfig.action_items.fallbackTitle, items: [] },
  };

  // Helper to categorize title
  const categorizeKey = (title: string, defaultKey: string) => {
   const titleLower = title.toLowerCase();
   if (titleLower.includes("người nói") || titleLower.includes("thành viên") || titleLower.includes("speaker") || titleLower.includes("đóng góp") || titleLower.includes("ý kiến")) {
    return "speakers";
   } if (titleLower.includes("thảo luận") || titleLower.includes("chủ đề") || titleLower.includes("discussion") || titleLower.includes("nội dung")) {
    return "discussion";
   } if (titleLower.includes("quyết định") || titleLower.includes("thống nhất") || titleLower.includes("decision") || titleLower.includes("kết luận")) {
    return "decisions";
   } if (titleLower.includes("hành động") || titleLower.includes("nhiệm vụ") || titleLower.includes("action") || titleLower.includes("kế hoạch") || titleLower.includes("phân công")) {
    return "action_items";
   } if (titleLower.includes("mục tiêu") || titleLower.includes("tổng quan") || titleLower.includes("overview")) {
    return "overview";
   }
   return defaultKey;
  };

  // 1. Process data.sections if available
  const rawSections = data.sections || [];
  if (rawSections.length > 0) {
   rawSections.forEach((sec, idx) => {
    const key = categorizeKey(sec.title || "", keysOrder[idx] || "overview");
    const itemsClean = (sec.items || [])
     .map((it) => it.replace(/^[-*•]\s*/, '').trim())
     .filter((it) => it.length > 0);

    if (itemsClean.length > 0) {
     sectionMap[key].items.push(...itemsClean);
    }
   });
  }

  // 2. Process data.overview if it contains markdown headers or text lines
  if (typeof data.overview === "string" && data.overview.trim().length > 0) {
   const lines = data.overview.split("\n");
   let currentKey = "overview";
   
   lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("##") || (trimmed.startsWith("**") && trimmed.endsWith("**"))) {
     const headerText = trimmed.replace(/#/g, '').replace(/\*/g, '').trim();
     currentKey = categorizeKey(headerText, currentKey);
    } else {
     const itemText = trimmed.replace(/^[-*•]\s*/, '').trim();
     if (itemText) {
      sectionMap[currentKey].items.push(itemText);
     }
    }
   });
  }

  // 3. Construct final 5 distinct section cards
  return keysOrder.map((key) => {
   const cfg = standardConfig[key];
   const parsed = sectionMap[key];
   
   // Clean & deduplicate items
   const uniqueItems = Array.from(new Set(parsed.items.filter(it => it.length > 0)));

   return {
    key,
    title: parsed.title || cfg.fallbackTitle,
    icon: cfg.icon,
    badgeColor: cfg.badgeColor,
    items: uniqueItems.length > 0 
     ? uniqueItems 
     : [
       key === "speakers" 
        ? "Nội dung trao đổi ý kiến đã được tích hợp đầy đủ trong phần Tổng quan & Thảo luận."
        : key === "discussion"
        ? "Chi tiết thảo luận các chủ đề chính được thể hiện chi tiết tại phần Tổng quan bối cảnh."
        : key === "decisions"
        ? "Cuộc họp mang tính chất chia sẻ thông tin, chưa ghi nhận quyết định mới được chốt."
        : key === "action_items"
        ? "Chưa có nhiệm vụ phân công mới trong cuộc họp này."
        : "Nội dung cuộc họp đã được ghi nhận."
       ],
   };
  });
 }, [data, t]);

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
    className={`fixed right-0 bottom-0 z-50 flex w-full max-w-[820px] flex-col overflow-hidden dark:bg-[#111] bg-white border-l dark:border-white/10 border-gray-200 shadow-2xl transition-transform duration-300 ease-out ${
     isOpen ? "translate-x-0" : "translate-x-full"
    }`}
    style={{ top: "72px" }}
    role="dialog"
    aria-modal="true"
    aria-label="Meeting Summary"
   >
    {/* Sticky header */}
    <div className="flex flex-shrink-0 items-center justify-between border-b dark:border-white/10 border-gray-200 dark:bg-[#111]/90 bg-white/90 backdrop-blur-md px-[40px] py-[24px]">
     <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8c00ff] to-[#0aa9f5] text-white shadow-[0_0_20px_rgba(140,0,255,0.3)]">
       <Sparkles className="h-6 w-6" />
      </div>
      <div>
       <h2 className="text-[26px] font-extrabold tracking-tight dark:text-white text-gray-900">
        {t("tab_summary")}
       </h2>
       <p className="text-[13px] font-medium dark:text-gray-400 text-gray-500">
        Báo cáo tóm tắt cuộc họp chuẩn hóa AI Intelligence
       </p>
      </div>
     </div>

     <button
      type="button"
      onClick={onClose}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] dark:text-gray-400 text-gray-500 transition-all duration-200 hover:dark:bg-white/10 hover:bg-gray-100 hover:dark:text-white hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
      aria-label="Close summary"
     >
      <XIcon className="h-[22px] w-[22px]" />
     </button>
    </div>

    {/* Scrollable Content */}
    <div className="flex-1 overflow-y-auto px-[40px] py-[32px] space-y-[24px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
     {formattedSections.length > 0 ? (
      formattedSections.map((sec) => (
       <div
        key={sec.key}
        className="group relative flex flex-col rounded-[22px] border dark:border-white/10 border-gray-200/80 dark:bg-white/[0.03] bg-gray-50/80 p-[24px] shadow-sm transition-all duration-300 hover:dark:bg-white/[0.06] hover:bg-gray-100/90 hover:shadow-md hover:border-purple-500/30"
       >
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-[16px]">
         <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sec.badgeColor} border shadow-sm`}>
          {sec.icon}
         </div>
         <h3 className="text-[19px] font-extrabold dark:text-white text-gray-900 tracking-tight">
          {sec.title}
         </h3>
        </div>

        {/* Section Items */}
        <ul className="space-y-[14px]">
         {sec.items.map((item, iIdx) => (
          <li key={iIdx} className="flex items-start gap-[12px] group/item">
           <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 group-hover/item:bg-purple-500 group-hover/item:text-white transition-all duration-200">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
           </div>
           <span className="text-[15px] font-medium leading-relaxed dark:text-gray-300 text-gray-700">
            {item}
           </span>
          </li>
         ))}
        </ul>
       </div>
      ))
     ) : (
      <div className="flex h-[250px] flex-col items-center justify-center text-center rounded-2xl border border-dashed dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 p-6">
       <FileText className="w-10 h-10 mb-3 text-purple-400/60" />
       <p className="text-[16px] font-bold dark:text-gray-300 text-gray-700">
        {t("no_summary_available")}
       </p>
      </div>
     )}
    </div>
   </div>
  </>
 );
}
