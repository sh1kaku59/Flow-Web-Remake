import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Header } from "../diary-detail/components/Header";
import { SearchIcon } from "../diary-detail/components/icons";
import { DiaryCard } from "./components/DiaryCard";
import { RenameModal } from "./components/RenameModal";
import { useDiary } from "./hooks/useDiary";
import { Meeting, SortOption } from "./types";
import { RefreshCcw } from "lucide-react";
import { useLanguage } from "../shared/i18n/LanguageContext";

const SORT_OPTIONS: SortOption[] = ["Most Recent", "Oldest", "A → Z", "Z → A", "Duration"];

interface DiaryPageProps {
 onOpenDiaryDetail?: (meetingId: string) => void;
}

function ChevronDownGlyph() {
 return (
  <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="currentColor">
   <path d="M6.2 8.8L12 14.6L17.8 8.8" />
  </svg>
 );
}

export function DiaryPage({ onOpenDiaryDetail }: DiaryPageProps) {
 const { t } = useLanguage();
 const [sortMenuOpen, setSortMenuOpen] = useState(false);
 const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
 const [isRenaming, setIsRenaming] = useState(false);
 const [flashMessage, setFlashMessage] = useState("");

 const {
  meetings,
  allMeetings,
  isLoading,
  isRefreshing,
  errorMessage,
  searchKeyword,
  sortOption,
  currentPage,
  totalPages,
  totalItems,
  hasResult,
  setSearchKeyword,
  setSortOption,
  setCurrentPage,
  refresh,
  renameMeeting,
 } = useDiary({ pageSize: 4 });

 const blockedTitles = useMemo(() => {
  if (!selectedMeeting) {
   return [];
  }
  return allMeetings
   .filter((meeting) => meeting.id !== selectedMeeting.id)
   .map((meeting) => meeting.title);
 }, [allMeetings, selectedMeeting]);

 const pageNumbers = useMemo(() => {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
 }, [totalPages]);

 const noResult = !isLoading && !isRefreshing && !errorMessage && !hasResult;

 return (
  <main className="h-screen w-full overflow-hidden dark:bg-[#0A0A0A] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-purple-500/30">
   <Header />

   <div className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-[1440px] min-h-0 px-[40px] py-[32px] relative z-10">
    <section className="flex h-full w-full min-h-0 flex-col rounded-[24px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 backdrop-blur-xl p-[32px] shadow-2xl">
     <div className="mx-auto w-full max-w-2xl flex h-[56px] shrink-0 items-center rounded-2xl border dark:border-white/10 border-gray-300 dark:bg-white/10 bg-gray-50 px-[20px] transition-all duration-300 hover:dark:border-white/20 hover:border-gray-400 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 shadow-inner">
      <SearchIcon className="h-[20px] w-[20px] dark:text-gray-500 text-gray-400" />
      <input
       value={searchKeyword}
       onChange={(event) => setSearchKeyword(event.target.value)}
       placeholder={t("search_placeholder")}
       className="ml-[12px] h-full w-full bg-transparent text-[16px] font-medium dark:text-white text-gray-900 outline-none placeholder:dark:text-gray-500 placeholder:text-gray-400"
      />
     </div>

     <div className="mt-[40px] flex shrink-0 items-center justify-between px-2">
      <div className="flex items-center gap-[12px]">
       <h1 className="text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{t("all_diaries")}</h1>
       <span className="flex h-6 w-6 items-center justify-center rounded-full dark:bg-white/10 bg-gray-200 text-[13px] font-medium dark:text-gray-400 text-gray-700">
        {totalItems}
       </span>
       {(isLoading || isRefreshing) && (
        <div className="flex items-center gap-2 text-[12px] font-bold text-purple-500 dark:text-purple-400 animate-pulse ml-2">
         <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
         <span>{t("syncing_database_diaries")}</span>
        </div>
       )}
      </div>

      <div className="relative flex items-center gap-[16px]">
       <div className="flex items-center gap-[8px] dark:text-gray-400 text-gray-600">
        <span className="text-[14px] font-medium">{t("sort_by")}</span>
       </div>

       <div className="relative">
        <button
         type="button"
         onClick={() => setSortMenuOpen((prev) => !prev)}
         className="flex h-[40px] min-w-[160px] items-center justify-between rounded-xl border dark:border-white/10 border-gray-300 dark:bg-white/10 bg-white px-[16px] text-[14px] font-medium dark:text-white text-gray-900 transition-colors hover:dark:bg-white/5 hover:bg-gray-100 shadow-sm"
        >
         {sortOption}
         <ChevronDownGlyph />
        </button>

        {sortMenuOpen ? (
         <div className="absolute right-0 z-20 mt-[8px] w-[160px] overflow-hidden rounded-xl border dark:border-white/10 border-gray-200 dark:bg-[#0A0A0A] bg-white shadow-2xl backdrop-blur-xl">
          {SORT_OPTIONS.map((option) => (
           <button
            key={option}
            type="button"
            onClick={() => {
             setSortOption(option);
             setSortMenuOpen(false);
            }}
            className={`flex h-[40px] w-full items-center px-[16px] text-left text-[14px] font-medium transition-colors ${
             option === sortOption
              ? "bg-purple-500/20 text-purple-400"
              : "dark:text-gray-400 text-gray-600 hover:dark:bg-white/10 hover:bg-gray-100"
            }`}
           >
            {option}
           </button>
          ))}
         </div>
        ) : null}
       </div>

       <button
        type="button"
        onClick={() => void refresh()}
        className="
         flex h-[40px] w-[40px] items-center justify-center
         rounded-xl dark:bg-white/10 bg-white border dark:border-white/10 border-gray-300 dark:text-gray-400 text-gray-600
         transition-all duration-300 shadow-sm
         hover:dark:bg-white/5 hover:bg-gray-100 hover:dark:text-white hover:text-gray-900
         active:scale-95
         disabled:opacity-50 disabled:cursor-not-allowed
        "
        aria-label="Refresh diaries"
        disabled={isRefreshing || isLoading}
       >
        <RefreshCcw
         size={18}
         strokeWidth={2}
         className={`
          transition-transform duration-500
          ${isRefreshing ? "animate-[spin_0.8s_linear_infinite]" : ""}
         `}
        />
       </button>
      </div>
     </div>

     <div className="mt-[24px] mb-[24px] h-px shrink-0 dark:bg-white/10 bg-gray-200" />

      {flashMessage && createPortal(
       <div className="fixed inset-0 z-[200] flex items-center justify-center dark:bg-black/60 bg-black/30 backdrop-blur-md animate-fade-in pointer-events-none">
        <div className="flex flex-col items-center gap-3.5 rounded-[24px] border dark:border-emerald-500/30 border-emerald-500/20 dark:bg-[#121212]/95 bg-white px-8 py-6 shadow-2xl backdrop-blur-xl animate-scale-up text-center">
         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.35)] animate-bounce" style={{ animationDuration: '2s' }}>
          <svg className="w-7 h-7 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
           <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
         </div>
         <span className="text-[17px] font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wide">{flashMessage}</span>
        </div>
       </div>,
       document.body
      )}

      {(isLoading || isRefreshing) ? (
       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2 flex-1 min-h-0 overflow-hidden pr-2">
        {[1, 2, 3, 4].map((i) => (
         <div
          key={i}
          className="relative flex flex-col justify-between h-full min-h-0 overflow-hidden rounded-[20px] border dark:border-white/10 border-gray-200/80 dark:bg-white/[0.04] bg-gray-50/80 px-[16px] py-[16px] md:px-[24px] md:py-[20px] shadow-sm"
         >
          {/* Shimmer gradient line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer pointer-events-none" />
          
          <div className="flex items-start justify-between">
           <div className="h-6 w-1/2 rounded-xl dark:bg-white/10 bg-gray-200 animate-pulse" />
           <div className="h-6 w-20 rounded-full dark:bg-purple-500/20 bg-purple-100 border border-purple-500/30 animate-pulse" />
          </div>

          <div className="my-4 flex flex-col gap-2.5">
           <div className="h-4 w-4/5 rounded-lg dark:bg-white/10 bg-gray-200 animate-pulse" />
           <div className="h-4 w-2/3 rounded-lg dark:bg-white/10 bg-gray-200 animate-pulse" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t dark:border-white/5 border-gray-200/60">
           <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full dark:bg-white/10 bg-gray-200 animate-pulse" />
            <div className="h-4 w-28 rounded-md dark:bg-white/10 bg-gray-200 animate-pulse" />
           </div>
           <div className="h-4 w-16 rounded-md dark:bg-white/10 bg-gray-200 animate-pulse" />
          </div>
         </div>
        ))}
       </div>
      ) : null}

     {!isLoading && !isRefreshing && errorMessage ? (
      <div className="mt-[18px] rounded-2xl border border-red-500/20 bg-red-500/5 px-[24px] py-[24px] text-center">
       <p className="text-[15px] font-medium text-red-400">{errorMessage}</p>
       <button
        type="button"
        onClick={() => void refresh()}
        className="mt-[16px] rounded-xl border dark:border-white/10 border-gray-300 dark:bg-white/10 bg-white px-[16px] py-[8px] text-[14px] font-medium dark:text-white text-gray-900 transition-colors hover:dark:bg-white/5 hover:bg-gray-100 shadow-sm"
       >
        {t("retry")}
       </button>
      </div>
     ) : null}

     {noResult ? (
      <div className="mt-[18px] flex flex-col items-center justify-center rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 px-[20px] py-[64px] text-center">
       <p className="text-[16px] font-medium dark:text-gray-400 text-gray-600">
        {searchKeyword.trim()
         ? t("no_search_result")
         : t("empty_workspace")}
       </p>
      </div>
     ) : null}

     {!isLoading && !isRefreshing && !errorMessage && hasResult ? (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2 flex-1 min-h-0 overflow-hidden pr-2">
        {meetings.map((meeting) => (
         <DiaryCard
          key={meeting.id}
          meeting={meeting}
          onOpenDetail={(meetingId) => onOpenDiaryDetail?.(meetingId)}
          onRename={(value) => {
           setSelectedMeeting(value);
          }}
         />
        ))}
       </div>

       <div className="mt-[24px] pt-[16px] border-t dark:border-white/10 border-gray-200 flex shrink-0 items-center justify-center gap-[12px]">
        <button
         type="button"
         onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
         disabled={currentPage === 1}
         className="px-4 py-2 text-[14px] font-medium dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 disabled:opacity-30 disabled:hover:dark:text-gray-400 disabled:hover:text-gray-600 transition-colors"
        >
         {t("btn_previous")}
        </button>

        <div className="flex items-center gap-2">
         {pageNumbers.map((page) => (
          <button
           key={page}
           type="button"
           onClick={() => setCurrentPage(page)}
           className={`h-[32px] w-[32px] flex items-center justify-center rounded-lg text-[14px] font-medium transition-colors ${
            page === currentPage
             ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 font-bold"
             : "dark:text-gray-400 text-gray-600 hover:dark:bg-white/10 hover:bg-gray-200 hover:dark:text-white hover:text-gray-900 border border-transparent"
           }`}
          >
           {page}
          </button>
         ))}
        </div>

        <button
         type="button"
         onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
         disabled={currentPage === totalPages}
         className="px-4 py-2 text-[14px] font-medium dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 disabled:opacity-30 disabled:hover:dark:text-gray-400 disabled:hover:text-gray-600 transition-colors"
        >
         {t("btn_next")}
        </button>
       </div>
      </div>
     ) : null}
    </section>
   </div>

   <RenameModal
    isOpen={selectedMeeting !== null}
    initialTitle={selectedMeeting?.title ?? ""}
    blockedTitles={blockedTitles}
    isSaving={isRenaming}
    onCancel={() => {
     setSelectedMeeting(null);
    }}
    onConfirm={async (nextTitle) => {
     if (!selectedMeeting) {
      return;
     }
     setIsRenaming(true);
     setFlashMessage("");
     try {
      await renameMeeting(selectedMeeting.id, nextTitle);
      setSelectedMeeting(null);
      setFlashMessage(t("diary_renamed_success"));
      window.setTimeout(() => setFlashMessage(""), 2500);
     } catch {
      // Keep modal open on failure
     } finally {
      setIsRenaming(false);
     }
    }}
   />
  </main>
 );
}
