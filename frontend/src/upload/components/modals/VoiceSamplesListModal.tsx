import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Mic, Plus, Play, Pause, Trash2, Edit2, X } from "lucide-react";
import { AddSampleModal } from "./AddSampleModal";
import { useLanguage } from "../../../shared/i18n/LanguageContext";

interface VoiceSample {
 id: string;
 name: string;
 file_name?: string;
 file_url?: string;
}

interface VoiceSamplesListModalProps {
 isOpen: boolean;
 onClose: () => void;
}

function formatTimeBadge(seconds: number): string {
 const m = Math.floor(seconds / 60);
 const s = Math.floor(seconds % 60);
 return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function VoiceSamplesListModal({ isOpen, onClose }: VoiceSamplesListModalProps) {
 const { t } = useLanguage();
 const [samples, setSamples] = useState<VoiceSample[]>([]);
 const [audioDurations, setAudioDurations] = useState<Record<string, number>>({});
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [editingSample, setEditingSample] = useState<VoiceSample | undefined>(undefined);
 const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
 const [playbackRemaining, setPlaybackRemaining] = useState<{ sampleId: string; seconds: number } | null>(null);
 const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
 const [isLoading, setIsLoading] = useState(false);
 
 const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1").replace(/\/+$/, "");

 const fetchSamples = async () => {
  setIsLoading(true);
  const startTime = Date.now();
  try {
   const res = await fetch(`${API_BASE_URL}/voice-samples`);
   if (res.ok) {
    const data = await res.json();
    const loadedSamples: VoiceSample[] = data.map((s: any) => ({
     id: s.id,
     name: s.speaker_label,
     file_url: `${API_BASE_URL}/voice-samples/${s.id}/audio`
    }));

    // Ensure smooth 500ms minimum loading duration so skeleton animation is visible
    const elapsed = Date.now() - startTime;
    if (elapsed < 500) {
     await new Promise((resolve) => setTimeout(resolve, 500 - elapsed));
    }

    setSamples(loadedSamples);

    // Measure exact duration for each audio sample asynchronously
    loadedSamples.forEach((sample) => {
     if (sample.file_url) {
      const audio = new Audio(sample.file_url);
      audio.onloadedmetadata = () => {
       if (audio.duration && !isNaN(audio.duration)) {
        setAudioDurations((prev) => ({
         ...prev,
         [sample.id]: Math.round(audio.duration)
        }));
       }
      };
     }
    });
   }
  } catch (e) {
   console.error("Failed to fetch voice samples", e);
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  if (isOpen) {
   fetchSamples();
  } else {
   if (audioElement) {
    audioElement.pause();
    setAudioElement(null);
    setPlayingSampleId(null);
    setPlaybackRemaining(null);
   }
  }
 }, [isOpen]);

 const handlePlayPause = (sample: VoiceSample) => {
  if (playingSampleId === sample.id && audioElement) {
   audioElement.pause();
   setPlayingSampleId(null);
   setPlaybackRemaining(null);
  } else {
   if (audioElement) {
    audioElement.pause();
   }
   if (sample.file_url) {
    const audio = new Audio(sample.file_url);
    
    audio.onloadedmetadata = () => {
     if (audio.duration && !isNaN(audio.duration)) {
      const totalSec = Math.round(audio.duration);
      setAudioDurations((prev) => ({ ...prev, [sample.id]: totalSec }));
      setPlaybackRemaining({ sampleId: sample.id, seconds: totalSec });
     }
    };

    audio.ontimeupdate = () => {
     const dur = audio.duration || audioDurations[sample.id] || 0;
     const rem = Math.max(0, Math.ceil(dur - audio.currentTime));
     setPlaybackRemaining({ sampleId: sample.id, seconds: rem });
    };

    audio.onended = () => {
     setPlayingSampleId(null);
     setPlaybackRemaining(null);
    };

    audio.play();
    setAudioElement(audio);
    setPlayingSampleId(sample.id);
   }
  }
 };

 if (!isOpen) return null;

 const handleAddSample = async (name: string, file: File | null) => {
  if (editingSample) {
   try {
    await fetch(`${API_BASE_URL}/voice-samples/${editingSample.id}`, {
     method: 'PATCH',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ speaker_label: name })
    });
    fetchSamples();
   } catch (e) {
    console.error(e);
   }
  } else {
   if (!file) return;
   const formData = new FormData();
   formData.append('speaker_label', name);
   formData.append('file', file);
   try {
    await fetch(`${API_BASE_URL}/voice-samples`, {
     method: 'POST',
     body: formData
    });
    fetchSamples();
   } catch (e) {
    console.error(e);
   }
  }
  setIsAddModalOpen(false);
  setEditingSample(undefined);
 };

 const handleDeleteSample = async (id: string) => {
  try {
   await fetch(`${API_BASE_URL}/voice-samples/${id}`, { method: 'DELETE' });
   fetchSamples();
  } catch (e) {
   console.error(e);
  }
 };

 const handleEditSample = (sample: VoiceSample) => {
  setEditingSample(sample);
  setIsAddModalOpen(true);
 };

 const handleOpenAdd = () => {
  setEditingSample(undefined);
  setIsAddModalOpen(true);
 };

 const handleCloseAddModal = () => {
  setIsAddModalOpen(false);
  setEditingSample(undefined);
 };

 const modalContent = (
  <div className="fixed inset-0 z-[90] flex items-center justify-center dark:bg-black/70 bg-black/50 backdrop-blur-md p-4 animate-modal-overlay">
   <div className="relative flex w-[640px] max-w-[92vw] max-h-[85vh] flex-col rounded-[28px] dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 shadow-2xl overflow-hidden animate-modal-content">
    
    {/* Ambient Glow */}
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

    {/* Header */}
    <div className="relative z-10 flex items-center justify-between px-8 pt-7 pb-4 border-b dark:border-white/10 border-gray-100">
     <div className="flex items-center gap-3.5">
      <div className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#8c00ff] to-[#0aa9f5] text-white shadow-[0_0_20px_rgba(140,0,255,0.35)]">
       <Mic className="h-[22px] w-[22px]" />
      </div>
      <div className="flex flex-col">
       <h2 className="text-[22px] font-extrabold tracking-tight dark:text-white text-gray-900">
        {t("voice_samples")}
       </h2>
       <p className="text-[13px] font-medium dark:text-gray-400 text-gray-500">
        {t("no_samples_hint")}
       </p>
      </div>
     </div>
     
     <button
      type="button"
      onClick={onClose}
      className="flex h-9 w-9 items-center justify-center rounded-full dark:bg-white/10 bg-gray-100 dark:hover:bg-white/20 hover:bg-gray-200 dark:text-gray-400 text-gray-600 transition-colors"
     >
      <X className="h-5 w-5" />
     </button>
    </div>

    {/* Scrollable List Body */}
    <div className="relative z-10 flex-1 overflow-y-auto px-8 py-5 space-y-3 min-h-[220px] max-h-[400px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
     {isLoading ? (
      <div className="space-y-3 py-1">
       {[1, 2, 3].map((i) => (
        <div
         key={i}
         className="relative flex items-center justify-between p-4 rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50/80 overflow-hidden"
        >
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer pointer-events-none" />
         <div className="flex items-center gap-4 min-w-0">
          <div className="h-11 w-11 rounded-full dark:bg-white/10 bg-gray-200 flex-shrink-0 animate-pulse" />
          <div className="flex flex-col gap-2 min-w-0">
           <div className="h-4 w-36 rounded-md dark:bg-white/10 bg-gray-200 animate-pulse" />
           <div className="h-3 w-16 rounded-full dark:bg-white/10 bg-gray-200 animate-pulse" />
          </div>
         </div>
         <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl dark:bg-white/10 bg-gray-200 animate-pulse" />
          <div className="h-9 w-9 rounded-xl dark:bg-white/10 bg-gray-200 animate-pulse" />
         </div>
        </div>
       ))}
       <div className="flex items-center justify-center gap-2.5 pt-3 pb-1 text-[13px] font-bold text-purple-500 dark:text-purple-400 animate-pulse">
        <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
        <span>{t("loading_voice_samples") || "Đang tải mẫu giọng nói từ cơ sở dữ liệu..."}</span>
       </div>
      </div>
     ) : (
      <>
       {samples.map((sample) => {
        const isPlaying = playingSampleId === sample.id;
        const totalSec = audioDurations[sample.id] || 0;
        const displaySec = (isPlaying && playbackRemaining?.sampleId === sample.id)
         ? playbackRemaining.seconds
         : totalSec;

        return (
         <div
          key={sample.id}
          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
           isPlaying
            ? 'dark:bg-purple-950/40 bg-purple-50/90 border-purple-400 dark:shadow-[0_0_20px_rgba(168,85,247,0.25)] shadow-md'
            : 'dark:bg-white/5 bg-gray-50/80 dark:border-white/10 border-gray-200/80 dark:hover:bg-white/10 hover:bg-gray-100 shadow-sm'
          }`}
         >
          <div className="flex items-center gap-4 min-w-0">
           <button
            type="button"
            onClick={() => handlePlayPause(sample)}
            className={`h-11 w-11 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
             isPlaying
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(140,0,255,0.4)] scale-105'
              : 'dark:bg-white/10 bg-purple-100 text-purple-600 dark:text-purple-300 hover:bg-gradient-to-r hover:from-[#8c00ff] hover:to-[#0aa9f5] hover:text-white'
            }`}
           >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
           </button>

           <div className="flex flex-col min-w-0">
            <span className="font-bold text-[16px] dark:text-gray-100 text-gray-900 truncate">
             {sample.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
             <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full dark:bg-white/10 bg-purple-100 dark:text-purple-300 text-purple-700 border dark:border-white/10 border-purple-200">
              {formatTimeBadge(displaySec)}
             </span>
             {isPlaying && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-500 dark:text-cyan-400 animate-pulse">
               <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
               Playing...
              </span>
             )}
            </div>
           </div>
          </div>

          <div className="flex items-center gap-2">
           <button
            type="button"
            onClick={() => handleEditSample(sample)}
            className="p-2.5 rounded-xl dark:bg-white/5 bg-gray-100 dark:hover:bg-white/15 hover:bg-gray-200 dark:text-gray-300 text-gray-700 transition-colors"
            title={t("rename")}
           >
            <Edit2 className="w-4 h-4" />
           </button>
           <button
            type="button"
            onClick={() => handleDeleteSample(sample.id)}
            className="p-2.5 rounded-xl dark:bg-red-500/10 bg-red-50 dark:hover:bg-red-500/20 hover:bg-red-100 dark:text-red-400 text-red-600 transition-colors"
            title={t("delete")}
           >
            <Trash2 className="w-4 h-4" />
           </button>
          </div>
         </div>
        );
       })}

       {samples.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed dark:border-white/10 border-gray-200/80 dark:bg-white/5 bg-gray-50/50">
         <Mic className="w-10 h-10 mb-3 text-purple-400/60" />
         <p className="text-[15px] font-bold dark:text-gray-300 text-gray-700">{t("no_samples")}</p>
         <p className="text-[13px] dark:text-gray-500 text-gray-500 mt-1 max-w-sm">{t("no_samples_hint")}</p>
        </div>
       )}
      </>
     )}
    </div>

    {/* Footer */}
    <div className="relative z-10 px-8 py-5 border-t dark:border-white/10 border-gray-100 dark:bg-[#161616] bg-gray-50/50 flex justify-end">
     <button
      type="button"
      onClick={handleOpenAdd}
      className="flex h-12 px-6 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8c00ff] via-[#3b82f6] to-[#0aa9f5] text-[15px] font-extrabold text-white shadow-[0_0_20px_rgba(140,0,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
     >
      <Plus className="w-5 h-5" />
      <span>{t("add_sample")}</span>
     </button>
    </div>

   </div>

   <AddSampleModal 
    isOpen={isAddModalOpen}
    onCancel={handleCloseAddModal}
    onAdd={handleAddSample}
    initialData={editingSample ? { id: editingSample.id, name: editingSample.name, fileName: editingSample.file_name || `${editingSample.name}_sample.wav` } : undefined}
   />
  </div>
 );

 return createPortal(modalContent, document.body);
}
