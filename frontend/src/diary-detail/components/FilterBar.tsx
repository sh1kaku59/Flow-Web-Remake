import { RefObject, useEffect, useRef, useState } from "react";
import { FilterType, TimestampOption } from "../types";
import { ChevronDownIcon, FilterIcon, SearchIcon, HashIcon } from "./icons";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface FilterBarProps {
 filterType: FilterType;
 onFilterTypeChange: (value: FilterType) => void;
 contentKeyword: string;
 onContentKeywordChange: (value: string) => void;
 speakerId: string;
 speakerOptions: Array<{ id: string; name: string; color?: string }>;
 onSpeakerChange: (speakerId: string) => void;
 timestampRange: string;
 timestampOptions: TimestampOption[];
 onTimestampChange: (value: string) => void;
 topicLabel: string;
 topicOptions: Array<{ label: string }>;
 onTopicChange: (value: string) => void;
}

const FILTER_KEYS: Record<FilterType, "filter_content" | "filter_speaker" | "filter_timestamp" | "filter_topic"> = {
 Content: "filter_content",
 Speaker: "filter_speaker",
 Timestamp: "filter_timestamp",
 Topic: "filter_topic",
};

const FILTER_OPTIONS: FilterType[] = ["Content", "Speaker", "Timestamp", "Topic"];
const ALL_OPTION = "ALL";

function useOutsideClick(ref: RefObject<HTMLDivElement>, onOutside: () => void) {
 useEffect(() => {
  const handler = (event: MouseEvent) => {
   const node = ref.current;
   if (!node || node.contains(event.target as Node)) {
    return;
   }
   onOutside();
  };

  window.addEventListener("mousedown", handler);
  return () => {
   window.removeEventListener("mousedown", handler);
  };
 }, [ref, onOutside]);
}

export function FilterBar({
 filterType,
 onFilterTypeChange,
 contentKeyword,
 onContentKeywordChange,
 speakerId,
 speakerOptions,
 onSpeakerChange,
 timestampRange,
 timestampOptions,
 onTimestampChange,
 topicLabel,
 topicOptions,
 onTopicChange,
}: FilterBarProps) {
 const { t } = useLanguage();
 const [showFilterDropdown, setShowFilterDropdown] = useState(false);
 const [showDynamicDropdown, setShowDynamicDropdown] = useState(false);

 const filterDropdownRef = useRef<HTMLDivElement>(null);
 const dynamicDropdownRef = useRef<HTMLDivElement>(null);

 useOutsideClick(filterDropdownRef, () => setShowFilterDropdown(false));
 useOutsideClick(dynamicDropdownRef, () => setShowDynamicDropdown(false));

 const rightPlaceholder =
  filterType === "Content"
   ? t("filter_kw_placeholder")
   : filterType === "Speaker"
    ? t("filter_speaker_placeholder")
    : filterType === "Topic"
    ? t("filter_topic_placeholder")
    : t("filter_time_placeholder");

 const allText = t("filter_all");

 return (
  <div className="flex w-full items-start gap-[12px]">
   <div ref={filterDropdownRef} className="relative w-[180px] flex-shrink-0">
    <button
     type="button"
     onClick={() => setShowFilterDropdown((prev) => !prev)}
     className="flex h-[40px] w-full items-center gap-[10px] rounded-[20px] border dark:border-white/10 border-gray-300 dark:bg-white/5 bg-white px-[16px] text-[16px] font-semibold dark:text-gray-300 text-gray-800 transition-all duration-200 hover:dark:border-white/20 hover:border-gray-400 hover:dark:bg-white/10 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 shadow-sm"
    >
     <FilterIcon className="h-[17px] w-[17px] dark:text-gray-400 text-gray-500" />
     <span>{t(FILTER_KEYS[filterType])}</span>
     <ChevronDownIcon className="ml-auto h-[14px] w-[14px] dark:text-gray-400 text-gray-500" />
    </button>

    {showFilterDropdown ? (
     <div className="absolute left-0 top-[46px] z-20 w-[182px] overflow-hidden rounded-[12px] border dark:border-white/10 border-gray-200 dark:bg-[#1a1a1a] bg-white shadow-2xl">
      {FILTER_OPTIONS.map((option) => (
       <button
        key={option}
        type="button"
        onClick={() => {
         onFilterTypeChange(option);
         setShowFilterDropdown(false);
         setShowDynamicDropdown(false);
        }}
        className={`flex h-[42px] w-full items-center px-[16px] text-left text-[15px] font-semibold transition-colors ${
         option === filterType
          ? "dark:bg-white/10 bg-purple-50 dark:text-white text-purple-600"
          : "dark:text-gray-400 text-gray-600 hover:dark:bg-white/5 hover:bg-gray-100 hover:dark:text-gray-200 hover:text-gray-900"
        }`}
       >
        {t(FILTER_KEYS[option])}
       </button>
      ))}
     </div>
    ) : null}
   </div>

   <div
    ref={dynamicDropdownRef}
    className="relative flex-1 min-w-0"
   >
    {filterType === "Content" ? (
     <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-[16px] top-1/2 z-10 h-[20px] w-[20px] -translate-y-1/2 dark:text-gray-500 text-gray-400" />
      <input
       type="text"
       value={contentKeyword}
       onChange={(event) => onContentKeywordChange(event.target.value)}
       className="h-[40px] w-full rounded-[20px] border dark:border-white/10 border-gray-300 dark:bg-white/5 bg-white pl-[54px] pr-[16px] text-[16px] font-semibold dark:text-gray-300 text-gray-900 outline-none transition-all duration-200 placeholder:dark:text-gray-500 placeholder:text-gray-400 hover:dark:border-white/20 hover:border-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-sm"
       placeholder={rightPlaceholder}
      />
     </div>
    ) : (
     <>
      <button
       type="button"
       onClick={() => setShowDynamicDropdown((prev) => !prev)}
       className="relative flex h-[40px] w-full items-center rounded-[20px] border dark:border-white/10 border-gray-300 dark:bg-white/5 bg-white pl-[54px] pr-[16px] text-left text-[16px] font-semibold dark:text-gray-400 text-gray-600 transition-all duration-200 hover:dark:border-white/20 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 shadow-sm"
      >
       {filterType === "Speaker" ? (
        <img
         src="/icons/lsicon_user-all-filled.svg"
         alt=""
         aria-hidden="true"
         className="pointer-events-none absolute left-[16px] top-[10px] h-[20px] w-[20px] object-contain opacity-60 dark:invert-0 invert"
        />
       ) : filterType === "Topic" ? (
        <HashIcon className="pointer-events-none absolute left-[16px] top-[10px] h-[20px] w-[20px] dark:text-gray-400 text-gray-500 opacity-60" />
       ) : (
        <img
         src="/icons/ion_time.svg"
         alt=""
         aria-hidden="true"
         className="pointer-events-none absolute left-[16px] top-[10px] h-[20px] w-[20px] object-contain opacity-60 dark:invert-0 invert"
        />
       )}

       <span className={`truncate ${speakerId || timestampRange || topicLabel ? "dark:text-gray-300 text-gray-900" : ""}`}>
        {filterType === "Speaker"
         ? (speakerId && speakerId !== ALL_OPTION
          ? speakerOptions.find((speaker) => speaker.id === speakerId)?.name
          : "") || rightPlaceholder
         : filterType === "Topic"
         ? (topicLabel && topicLabel !== ALL_OPTION
          ? topicLabel
          : rightPlaceholder)
         : (timestampRange && timestampRange !== ALL_OPTION
          ? timestampRange
          : rightPlaceholder)}
       </span>
       <ChevronDownIcon className="ml-auto h-[14px] w-[14px] dark:text-gray-500 text-gray-400" />
      </button>

      {showDynamicDropdown ? (
       <div className="absolute left-0 top-[46px] z-20 max-h-[228px] w-full overflow-y-auto rounded-[12px] border dark:border-white/10 border-gray-200 dark:bg-[#1a1a1a] bg-white py-[6px] shadow-2xl">
         {filterType === "Speaker"
         ? [{ id: ALL_OPTION, name: allText, color: undefined }, ...speakerOptions].map((speaker) => (
          <button
           key={speaker.id}
           type="button"
           onClick={() => {
            onSpeakerChange(speaker.id);
            setShowDynamicDropdown(false);
           }}
           className="flex h-[40px] w-full items-center gap-[10px] px-[16px] text-[15px] font-semibold dark:text-gray-400 text-gray-700 transition-colors hover:dark:bg-white/5 hover:bg-gray-100 hover:dark:text-gray-200 hover:text-gray-900"
          >
           {speaker.name === allText || speaker.id === ALL_OPTION ? (
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border dark:border-white/20 border-gray-300 dark:bg-white/5 bg-gray-100">
             <span className="h-[6px] w-[6px] rounded-full dark:bg-gray-500 bg-gray-400" />
            </span>
           ) : (
            <span
             className="flex h-[20px] w-[20px] items-center justify-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.3)] text-white text-[11px] font-bold"
             style={{ backgroundColor: speaker.color || "#6b7280" }}
            >
             {speaker.name.charAt(0).toUpperCase()}
            </span>
           )}
           {speaker.name}
          </button>
         ))
         : filterType === "Topic"
         ? [{ label: allText }, ...topicOptions].map((topic) => (
          <button
           key={topic.label}
           type="button"
           onClick={() => {
            onTopicChange(topic.label === allText ? ALL_OPTION : topic.label);
            setShowDynamicDropdown(false);
           }}
           className="flex h-[40px] w-full items-center justify-center px-[16px] text-center text-[15px] font-semibold dark:text-gray-400 text-gray-700 transition-colors hover:dark:bg-white/5 hover:bg-gray-100 hover:dark:text-gray-200 hover:text-gray-900"
          >
           {topic.label}
          </button>
         ))
         : (
          <>
           <button
            type="button"
            onClick={() => {
             onTimestampChange(ALL_OPTION);
             setShowDynamicDropdown(false);
            }}
            className="flex h-[40px] w-full items-center justify-center px-[16px] text-center text-[15px] font-semibold dark:text-gray-400 text-gray-700 transition-colors hover:dark:bg-white/5 hover:bg-gray-100 hover:dark:text-gray-200 hover:text-gray-900"
           >
            {allText}
           </button>
           {timestampOptions.map((option) => (
            <button
             key={option.label}
             type="button"
             onClick={() => {
              onTimestampChange(option.label);
              setShowDynamicDropdown(false);
             }}
             className="flex h-[40px] w-full items-center justify-center px-[16px] text-center text-[15px] font-semibold dark:text-gray-400 text-gray-700 transition-colors hover:dark:bg-white/5 hover:bg-gray-100 hover:dark:text-gray-200 hover:text-gray-900"
            >
             {option.label}
            </button>
           ))}
          </>
         )}
       </div>
      ) : null}
     </>
    )}
   </div>
  </div>
 );
}
