import { useEffect, useMemo, useState } from "react";
import { AudioPlayer } from "./components/AudioPlayer";
import { ChartPanel } from "./components/ChartPanel";
import { FilterBar } from "./components/FilterBar";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { SummaryPanel } from "./components/SummaryPanel";
import { ReportExportModal } from "./components/ReportExportModal";
import { TranscriptList } from "./components/TranscriptList";
import {
 FiltersState,
 fetchDiaryDetail,
 filterTranscriptSegments,
 resolveSupabaseAudioUrl,
} from "./mockApi";
import { BackIcon } from "./components/icons";
import { Meeting, Speaker, TranscriptSegment, TimestampOption, Topic } from "./types";
import { formatTime } from "./utils";
import { useLanguage } from "../shared/i18n/LanguageContext";

interface DiaryDetailPageProps {
 meetingId: string;
}

const DEFAULT_FILTERS: FiltersState = {
 filterType: "Content",
 contentKeyword: "",
 speakerId: "ALL",
 timestampRange: "ALL",
 globalQuery: "",
 topicLabel: "ALL",
};

function buildTimestampOptionsFromSegments(
 segments: TranscriptSegment[]
): TimestampOption[] {
 const sorted = [...segments].sort((left, right) => left.start_time - right.start_time);
 const seen = new Set<string>();

 return sorted.reduce<TimestampOption[]>((acc, segment) => {
  const label = `${formatTime(segment.start_time)} - ${formatTime(segment.end_time)}`;
  if (seen.has(label)) {
   return acc;
  }

  seen.add(label);
  acc.push({
   label,
   start: segment.start_time,
   end: segment.end_time,
  });
  return acc;
 }, []);
}

export function DiaryDetailPage({ meetingId }: DiaryDetailPageProps) {
 const { t } = useLanguage();
 const [meeting, setMeeting] = useState<Meeting | null>(null);
 const [speakers, setSpeakers] = useState<Speaker[]>([]);
 const [allSegments, setAllSegments] = useState<TranscriptSegment[]>([]);
 const [topics, setTopics] = useState<Topic[]>([]);
 const [summaryData, setSummaryData] = useState<any>(null);
 const [chartData, setChartData] = useState<any>(null);
 const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
 const [isLoading, setIsLoading] = useState(true);
 const [loadError, setLoadError] = useState("");

 const [currentTime, setCurrentTime] = useState(0);
 const [isPlaying, setIsPlaying] = useState(false);
 const [seekTo, setSeekTo] = useState<number | null>(null);

 const [showChart, setShowChart] = useState(false);
 const [showSummary, setShowSummary] = useState(false);
 const [showReportModal, setShowReportModal] = useState(false);

 useEffect(() => {
  let mounted = true;

  setIsLoading(true);
  setLoadError("");
  setFilters(DEFAULT_FILTERS);
  setCurrentTime(0);
  setIsPlaying(false);
  setSeekTo(null);

  fetchDiaryDetail(meetingId)
   .then((data) => {
    if (!mounted) {
     return;
    }
    setMeeting(data.meeting);
    setSpeakers(data.speakers);
    setAllSegments(data.transcriptSegments);
    setTopics(data.topics || []);
    setSummaryData(data.summaryData || null);
    setChartData(data.chartData || null);
   })
   .catch((error) => {
    if (!mounted) {
     return;
    }
    setLoadError(
     error instanceof Error ? error.message : "Unable to load diary detail."
    );
   })
   .finally(() => {
    if (mounted) {
     setIsLoading(false);
    }
   });

  return () => {
   mounted = false;
  };
 }, [meetingId]);

 const speakersById = useMemo(() => {
  return speakers.reduce<Record<string, Speaker>>((acc, speaker) => {
   acc[speaker.id] = speaker;
   return acc;
  }, {});
 }, [speakers]);

 const speakerOptions = useMemo(() => {
  return speakers.map((speaker) => ({
   id: speaker.id,
   name: speaker.speakers_name,
   color: speaker.color,
  }));
 }, [speakers]);

 const timestampOptions = useMemo(
  () => buildTimestampOptionsFromSegments(allSegments),
  [allSegments]
 );

 const topicOptions = useMemo(() => {
  return topics.map((t) => ({ label: t.label }));
 }, [topics]);

 const filteredSegments = useMemo(() => {
  return filterTranscriptSegments(allSegments, filters, topics);
 }, [allSegments, filters, topics]);

 const activeSegmentId = useMemo(() => {
  const active = filteredSegments.find(
   (segment) => currentTime >= segment.start_time && currentTime < segment.end_time
  );
  return active ? active.id : null;
 }, [currentTime, filteredSegments]);

 const audioUrl = meeting ? resolveSupabaseAudioUrl(meeting.audio_url) : "";

 const audioDuration = useMemo(() => {
  if (meeting?.duration && meeting.duration > 0) {
   return meeting.duration;
  }

  if (allSegments.length === 0) {
   return 0;
  }

  return Math.max(...allSegments.map((segment) => segment.end_time));
 }, [allSegments, meeting?.duration]);

 const isCompletedMeeting = meeting?.status ? meeting.status === "Completed" : true;
 const topicValue = meeting?.topic?.trim() || "No topic available";

 const handleSegmentClick = (segment: TranscriptSegment) => {
  setSeekTo(segment.start_time);
  setCurrentTime(segment.start_time);
 };

  if (isLoading) {
   return (
    <main className="h-screen w-full dark:bg-[#0A0A0A] bg-gray-50 dark:text-white text-gray-900 font-sans flex justify-center overflow-hidden">
     <div className="w-full h-full flex flex-col relative">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
       <div className="flex flex-col items-center gap-6 rounded-3xl border dark:border-white/10 border-black/10 dark:bg-white/5 bg-black/5 p-12 backdrop-blur-xl shadow-2xl">
        <div className="relative flex items-center justify-center">
         <div className="h-16 w-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 border-r-cyan-400 animate-spin shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
         <div className="absolute h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 blur-md opacity-60 animate-pulse" />
        </div>
         <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
           {t("loading_meeting_intelligence")}
          </h3>
          <p className="text-sm dark:text-gray-400 text-gray-600">
           {t("fetching_meeting_data_hint")}
          </p>
         </div>
       </div>
      </div>
     </div>
    </main>
   );
  }

 if (loadError || !meeting) {
  return (
   <main className="h-screen w-full dark:bg-[#0A0A0A] bg-gray-50 dark:text-white text-gray-900 font-sans flex justify-center overflow-hidden">
    <div className="w-full h-full flex flex-col">
     <Header />
     <div className="flex-1 min-h-0 px-6 py-4">
      <div className="mx-auto w-full">
       <div className="text-[14px] font-medium text-red-400">
        {loadError || "Missing meeting data."}
       </div>
      </div>
     </div>
    </div>
   </main>
  );
 }

 return (
  <main className="h-screen w-full dark:bg-[#0A0A0A] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-purple-500/30 flex justify-center overflow-hidden">
   <div className="w-full h-full flex flex-col relative">
    <Header />

    <div className="flex-1 min-h-0 px-4 py-4 md:px-[40px] max-w-[1440px] mx-auto w-full relative z-10">
     <section className="mx-auto flex h-full w-full min-h-0 flex-col overflow-hidden rounded-[24px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-200 backdrop-blur-xl p-[16px] md:p-[24px] md:pt-[24px] shadow-2xl">
      <div className="flex-shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-2xl dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 p-[12px] md:px-[24px] gap-2">
         <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-[6px] rounded-xl px-3 py-2 text-[14px] font-medium dark:text-gray-400 text-gray-600 transition-all duration-300 ease-out hover:dark:text-white hover:text-gray-900 hover:dark:bg-white/10 hover:bg-gray-200"
         >
          <BackIcon className="h-[18px] w-[18px]" />
          <span className="hidden md:inline">{t("back")}</span>
         </button>
         <div className="flex flex-col items-center justify-center min-w-0 flex-1 px-4">
          <h1 className="text-[20px] md:text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 truncate w-full text-center">{meeting.title}</h1>
          {topicValue && (
           <span className="mt-1 inline-block rounded-full dark:bg-white/10 bg-gray-200 px-[10px] py-[2px] text-[13px] font-medium dark:text-gray-400 text-gray-700 truncate max-w-full">
            {topicValue}
           </span>
          )}
         </div>
         <div className="w-[40px] md:w-[72px] shrink-0" />
        </div>

       <div>
        <SearchBar
         value={filters.globalQuery}
         onChange={(value) =>
          setFilters((prev) => ({
           ...prev,
           globalQuery: value,
          }))
         }
         onChartClick={() => {
          setShowSummary(false);
          setShowChart((prev) => !prev);
         }}
         onSummaryClick={() => {
          setShowChart(false);
          setShowSummary((prev) => !prev);
         }}
         onReportClick={() => {
          setShowSummary(false);
          setShowChart(false);
          setShowReportModal(true);
         }}
        />
       </div>
      </div>

      <div className="mt-[16px] flex min-h-0 flex-1 flex-col rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-white/10 bg-gray-50 px-[12px] md:px-[16px] pb-[16px] pt-[16px]">
       {isCompletedMeeting ? (
        <>
         <div className="flex-shrink-0">
          <FilterBar
           filterType={filters.filterType}
           onFilterTypeChange={(value) =>
            setFilters((prev) => ({
             ...prev,
             filterType: value,
             contentKeyword: value === "Content" ? prev.contentKeyword : "",
             speakerId: value === "Speaker" ? prev.speakerId : "ALL",
             timestampRange: value === "Timestamp" ? prev.timestampRange : "ALL",
            }))
           }
           contentKeyword={filters.contentKeyword}
           onContentKeywordChange={(value) =>
            setFilters((prev) => ({
             ...prev,
             contentKeyword: value,
            }))
           }
           speakerId={filters.speakerId}
           speakerOptions={speakerOptions}
           onSpeakerChange={(speakerId) =>
            setFilters((prev) => ({
             ...prev,
             speakerId,
            }))
           }
           timestampRange={filters.timestampRange}
           timestampOptions={timestampOptions}
           onTimestampChange={(value) =>
            setFilters((prev) => ({
             ...prev,
             timestampRange: value,
            }))
           }
           topicLabel={filters.topicLabel}
           topicOptions={topicOptions}
           onTopicChange={(value) =>
            setFilters((prev) => ({
             ...prev,
             topicLabel: value,
            }))
           }
          />
         </div>

         <div className="mt-[10px] flex flex-1 min-h-0 flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto px-[6px] scrollbar-hide">
           <TranscriptList
            segments={filteredSegments}
            speakersById={speakersById}
            activeSegmentId={activeSegmentId}
            highlightKeyword={
             filters.filterType === "Content" ? filters.contentKeyword : ""
            }
            onSegmentClick={handleSegmentClick}
           />
          </div>

          <div className="mt-[10px] flex-shrink-0">
           <AudioPlayer
            audioUrl={audioUrl}
            duration={audioDuration}
            currentTime={currentTime}
            isPlaying={isPlaying}
            seekTo={seekTo}
            segments={allSegments}
            speakersById={speakersById}
            onSeekHandled={() => setSeekTo(null)}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
            onSeek={(seconds) => {
             setSeekTo(seconds);
             setCurrentTime(seconds);
            }}
            onTimeUpdate={setCurrentTime}
            onEnded={() => setIsPlaying(false)}
           />
          </div>
         </div>
        </>
       ) : (
        <div className="flex flex-1 items-center justify-center rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 px-[20px] text-center text-[16px] font-medium dark:text-gray-400 text-gray-600">
         Detailed transcript extraction is available only when meeting status is Completed.
        </div>
       )}
      </div>
     </section>
    </div>
   </div>

   {/* ── Side panels ──────────────────────────────────────────────────── */}
   <SummaryPanel
    isOpen={showSummary}
    onClose={() => setShowSummary(false)}
    data={summaryData ?? null}
   />
   <ChartPanel
    isOpen={showChart}
    onClose={() => setShowChart(false)}
    data={chartData ?? null}
   />
   <ReportExportModal
    isOpen={showReportModal}
    onClose={() => setShowReportModal(false)}
    meetingId={meetingId}
    meetingTitle={meeting?.title || "Meeting"}
   />
  </main>
 );
}
