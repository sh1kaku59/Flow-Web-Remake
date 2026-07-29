import { useEffect, useState } from "react";
import type { UploadState } from "../types";
import { Users, FileText, BrainCircuit, AudioLines, Sparkles, Mic, Radio, UploadCloud } from "lucide-react";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface ProcessingViewProps {
 uploadState: UploadState;
 audioDurationSec?: number;
}

export function ProcessingView({ uploadState, audioDurationSec }: ProcessingViewProps) {
 const { t } = useLanguage();
 const [secondsElapsed, setSecondsElapsed] = useState(0);

 useEffect(() => {
  setSecondsElapsed(0);
  const timer = setInterval(() => {
   setSecondsElapsed((s) => s + 1);
  }, 1000);
  return () => clearInterval(timer);
 }, [uploadState]);

 const getEstimatedSeconds = (step: string) => {
  const duration = audioDurationSec && audioDurationSec > 0 ? audioDurationSec : 120;
  if (step === "uploading" || step === "step1") {
   return Math.max(12, Math.round(duration * 0.12 + 6));
  } else if (step === "step2") {
   return Math.max(20, Math.round(duration * 0.30 + 10));
  } else if (step === "step3") {
   return Math.max(15, Math.round(duration * 0.18 + 8));
  }
  return 30;
 };

 const getStepConfig = () => {
  switch (uploadState) {
   case "uploading":
    return {
     stepNum: 1,
     title: "Truyền tải âm thanh & Khởi tạo AI",
     subtitle: "Đang gửi dữ liệu âm thanh an toàn đến mô hình Pyannote & Whisper...",
     estimatedSeconds: getEstimatedSeconds("uploading"),
     nearFinishHint: t("near_finish_hint_uploading"),
     borderGradient: "from-[#8c00ff] via-[#a855f7] to-[#0aa9f5]",
     screenAura: "from-purple-900/35 via-purple-950/15 to-transparent",
     icon: (
      <div className="relative flex items-center justify-center">
       <div className="absolute inset-[-14px] rounded-full border-2 border-purple-500/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
       <div className="absolute inset-[-28px] rounded-full border border-cyan-400/25 animate-pulse" />
       
       <div className="relative h-[125px] w-[125px] rounded-full dark:bg-gradient-to-br dark:from-[#8c00ff]/30 dark:via-[#9333ea]/20 dark:to-[#0aa9f5]/15 bg-gradient-to-br from-purple-100 via-indigo-50 to-cyan-100 border border-purple-400/60 dark:border-purple-500/50 shadow-[0_0_40px_rgba(140,0,255,0.3)] flex items-center justify-center backdrop-blur-xl">
        <UploadCloud className="h-[52px] w-[52px] text-purple-600 dark:text-purple-300 animate-bounce drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
       </div>
      </div>
     ),
    };

   case "step1":
    return {
     stepNum: 1,
     title: t("processing_step1"),
     subtitle: t("step1_subtitle"),
     estimatedSeconds: getEstimatedSeconds("step1"),
     nearFinishHint: t("near_finish_hint_step1"),
     borderGradient: "from-[#8c00ff] via-[#a855f7] to-[#0aa9f5]",
     screenAura: "from-purple-900/35 via-purple-950/15 to-transparent",
     icon: (
      <div className="relative flex items-center justify-center">
       <div className="absolute inset-[-14px] rounded-full border-2 border-purple-500/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
       <div className="absolute inset-[-28px] rounded-full border border-purple-400/25 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_0.6s]" />
       <div className="absolute inset-[-42px] rounded-full border border-cyan-400/15 animate-pulse" />

       <div className="relative h-[125px] w-[125px] rounded-full dark:bg-gradient-to-br dark:from-[#8c00ff]/30 dark:via-[#9333ea]/20 dark:to-[#0aa9f5]/15 bg-gradient-to-br from-purple-100 via-indigo-50 to-cyan-100 border border-purple-400/60 dark:border-purple-500/50 shadow-[0_0_40px_rgba(140,0,255,0.3)] flex items-center justify-center backdrop-blur-xl overflow-visible group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-purple-600/20 via-transparent to-transparent animate-pulse overflow-hidden" />
        
        <div className="relative z-10 flex items-center justify-center">
         <Mic className="h-[48px] w-[48px] text-purple-600 dark:text-purple-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
        </div>

        <div className="absolute -top-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full dark:bg-purple-900/90 bg-purple-600 text-white border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.6)] backdrop-blur-md animate-bounce" style={{ animationDuration: '2.5s' }}>
         <Users className="h-5 w-5 text-cyan-200 dark:text-cyan-200" />
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-1 h-3">
         <span className="w-1 bg-purple-500 dark:bg-purple-400 rounded-full animate-[pulse_0.8s_infinite]" style={{ height: '60%' }} />
         <span className="w-1 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-[pulse_0.8s_infinite_0.2s]" style={{ height: '100%' }} />
         <span className="w-1 bg-purple-400 dark:bg-purple-300 rounded-full animate-[pulse_0.8s_infinite_0.4s]" style={{ height: '40%' }} />
         <span className="w-1 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-[pulse_0.8s_infinite_0.1s]" style={{ height: '80%' }} />
        </div>
       </div>
      </div>
     ),
    };

   case "step2":
    return {
     stepNum: 2,
     title: t("processing_step3"),
     subtitle: t("step2_subtitle"),
     estimatedSeconds: getEstimatedSeconds("step2"),
     nearFinishHint: t("near_finish_hint_step2"),
     borderGradient: "from-[#0aa9f5] via-[#0284c7] to-[#8c00ff]",
     screenAura: "from-cyan-900/35 via-blue-950/15 to-transparent",
     icon: (
      <div className="relative flex items-center justify-center">
       <div className="absolute inset-[-14px] rounded-full border-2 border-cyan-500/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
       <div className="absolute inset-[-28px] rounded-full border border-cyan-400/25 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_0.6s]" />
       <div className="absolute inset-[-42px] rounded-full border border-purple-400/15 animate-pulse" />

       <div className="relative h-[125px] w-[125px] rounded-full dark:bg-gradient-to-br dark:from-[#0aa9f5]/30 dark:via-[#3b82f6]/20 dark:to-[#8c00ff]/15 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100 border border-cyan-400/60 dark:border-cyan-500/50 shadow-[0_0_40px_rgba(10,169,245,0.3)] flex items-center justify-center backdrop-blur-xl overflow-visible group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent animate-pulse overflow-hidden" />

        <div className="relative z-10 flex items-center justify-center gap-2">
         <AudioLines className="h-[42px] w-[42px] text-cyan-600 dark:text-cyan-200 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse" />
         <FileText className="h-[34px] w-[34px] text-purple-600 dark:text-purple-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] animate-[bounce_3s_infinite]" />
        </div>

        <div className="absolute -top-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full dark:bg-cyan-950/90 bg-cyan-600 text-white border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.6)] backdrop-blur-md">
         <Radio className="h-5 w-5 text-white dark:text-cyan-300 animate-ping" />
        </div>
       </div>
      </div>
     ),
    };

   case "step3":
   case "completed":
    return {
     stepNum: 3,
     title: t("processing_step5"),
     subtitle: t("step3_subtitle"),
     estimatedSeconds: getEstimatedSeconds("step3"),
     nearFinishHint: t("near_finish_hint_step3"),
     borderGradient: "from-[#8c00ff] via-[#3b82f6] to-[#0aa9f5]",
     screenAura: "from-purple-900/25 via-cyan-950/20 to-transparent",
     icon: (
      <div className="relative flex items-center justify-center">
       <div className="absolute inset-[-14px] rounded-full border-2 border-purple-500/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
       <div className="absolute inset-[-28px] rounded-full border border-cyan-400/30 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_0.6s]" />
       <div className="absolute inset-[-42px] rounded-full border border-indigo-400/20 animate-pulse" />

       <div className="relative h-[125px] w-[125px] rounded-full dark:bg-gradient-to-br dark:from-[#8c00ff]/25 dark:via-[#3b82f6]/25 dark:to-[#0aa9f5]/25 bg-gradient-to-br from-indigo-100 via-purple-50 to-cyan-100 border border-indigo-400/60 dark:border-indigo-500/50 shadow-[0_0_45px_rgba(99,102,241,0.35)] flex items-center justify-center backdrop-blur-xl overflow-visible group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-indigo-600/25 via-transparent to-transparent animate-pulse overflow-hidden" />

        <div className="relative z-10 flex items-center justify-center">
         <BrainCircuit className="h-[54px] w-[54px] text-indigo-600 dark:text-cyan-200 drop-shadow-[0_0_15px_rgba(59,130,246,0.9)] transition-transform duration-500 group-hover:scale-110" />
        </div>

        <div className="absolute -top-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full dark:bg-purple-900/90 bg-purple-600 text-white border border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.6)] backdrop-blur-md animate-bounce">
         <Sparkles className="h-5 w-5 text-amber-300" />
        </div>
       </div>
      </div>
     ),
    };

   default:
    return null;
  }
 };

 const config = getStepConfig();
 if (!config) return null;

 const currentStep = config.stepNum;
 const remainingSeconds = config.estimatedSeconds - secondsElapsed;
 const isNearCompletion = remainingSeconds <= 3;
 const displayMins = Math.floor(Math.max(0, remainingSeconds) / 60);
 const displaySecs = Math.max(0, remainingSeconds) % 60;

 return (
  <div className="relative flex items-center justify-center p-2 group w-full max-w-[680px]">
   {/* Full-Screen Soft Ambient Aura Glow */}
   <div className={`fixed inset-0 pointer-events-none z-0 transition-all duration-1000 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${config.screenAura} animate-pulse`} />

   {/* Floating Transparent Liquid Glass Aura Orbs */}
   <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-purple-600/30 blur-3xl pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />
   <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl pointer-events-none animate-[pulse_5s_ease-in-out_infinite_1s]" />
   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none animate-ping opacity-40" />

   {/* Gradient Glowing Outer Border */}
   <div className={`relative w-full rounded-[32px] p-[2px] bg-gradient-to-r ${config.borderGradient} shadow-[0_12px_45px_rgba(140,0,255,0.3)] transition-all duration-700 z-10`}>
    <div
     className="relative z-10 flex h-[510px] w-full flex-col items-center justify-between rounded-[30px] dark:bg-[#121212]/95 bg-white/95 backdrop-blur-2xl px-[24px] md:px-[44px] py-[32px] overflow-hidden animate-fade-slide-in transition-all duration-700 ease-in-out dark:text-white text-gray-900"
    >
     {/* Background Shimmer Effect */}
     <div className="absolute inset-0 -translate-x-full animate-[shimmer_3.5s_infinite] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent pointer-events-none" />

     {/* Progress Steps Header */}
     <div className="relative z-10 flex w-full max-w-[480px] items-center justify-between mt-1">
      {/* Step 1 */}
      <div className={`flex flex-col items-center gap-[4px] transition-all duration-500 ${currentStep === 1 ? 'opacity-100 scale-105' : 'opacity-50'}`}>
       <div className={`h-[9px] w-[9px] rounded-full ${currentStep >= 1 ? 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.9)]' : 'dark:bg-white/30 bg-gray-300'}`} />
       <span className={`font-extrabold ${currentStep === 1 ? 'text-[18px] text-purple-600 dark:text-purple-400' : 'text-[15px] dark:text-gray-400 text-gray-600'} transition-all duration-300`}>
        {t("step_1")}
       </span>
      </div>
      
      <div className="flex-1 px-[12px]">
       <div className="h-[3px] w-full dark:bg-white/10 bg-gray-200 rounded-full overflow-hidden relative">
        <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out ${currentStep > 1 ? 'w-full' : 'w-0'}`} />
       </div>
      </div>
      
      {/* Step 2 */}
      <div className={`flex flex-col items-center gap-[4px] transition-all duration-500 ${currentStep === 2 ? 'opacity-100 scale-105' : 'opacity-50'}`}>
       <div className={`h-[9px] w-[9px] rounded-full ${currentStep >= 2 ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]' : 'dark:bg-white/30 bg-gray-300'}`} />
       <span className={`font-extrabold ${currentStep === 2 ? 'text-[18px] text-cyan-600 dark:text-cyan-400' : 'text-[15px] dark:text-gray-400 text-gray-600'} transition-all duration-300`}>
        {t("step_2")}
       </span>
      </div>
      
      <div className="flex-1 px-[12px]">
       <div className="h-[3px] w-full dark:bg-white/10 bg-gray-200 rounded-full overflow-hidden relative">
        <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-out ${currentStep > 2 ? 'w-full' : 'w-0'}`} />
       </div>
      </div>
      
      {/* Step 3 */}
      <div className={`flex flex-col items-center gap-[4px] transition-all duration-500 ${currentStep === 3 ? 'opacity-100 scale-105' : 'opacity-50'}`}>
       <div className={`h-[9px] w-[9px] rounded-full ${currentStep >= 3 ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]' : 'dark:bg-white/30 bg-gray-300'}`} />
       <span className={`font-extrabold ${currentStep === 3 ? 'text-[18px] text-blue-600 dark:text-blue-400' : 'text-[15px] dark:text-gray-400 text-gray-600'} transition-all duration-300`}>
        {t("step_3")}
       </span>
      </div>
     </div>

     {/* Content */}
     <div className="relative z-10 flex flex-col items-center text-center mt-[12px] flex-1 justify-center animate-fade-in" key={currentStep}>
      <h2 className="mb-[8px] text-[26px] md:text-[28px] font-extrabold tracking-tight dark:text-white text-gray-900">
       {config.title}
      </h2>
      <p className="mb-[28px] text-[15px] font-medium dark:text-gray-300 text-gray-600 max-w-md">
       {config.subtitle}
      </p>

      <div className="flex items-center justify-center transform transition-transform hover:scale-105 duration-500 mb-[32px]">
       {config.icon}
      </div>
      
      {/* Timer Badge with Rotating Clock Needle */}
      <div className="flex items-center gap-[8px] rounded-full dark:bg-white/10 bg-purple-50/90 px-[22px] py-[9px] backdrop-blur-md border dark:border-white/15 border-purple-200 shadow-md">
       <div className="relative h-4.5 w-4.5 shrink-0 text-purple-600 dark:text-cyan-400">
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
         <circle cx="12" cy="12" r="9" />
         <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
        <svg className="absolute inset-0 h-4.5 w-4.5 animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
         <line x1="12" y1="12" x2="12" y2="6.5" />
        </svg>
       </div>
       <span className="text-[14px] font-semibold dark:text-gray-200 text-gray-700 tracking-wide">
        {t("est_processing_time")}{" "}
        <span className="font-extrabold text-purple-600 dark:text-cyan-400 ml-1">
         {isNearCompletion ? (
          config.nearFinishHint
         ) : (
          `${displayMins > 0 ? `${displayMins}m ` : ""}${displaySecs}s`
         )}
        </span>
       </span>
      </div>
     </div>

     {/* Footer Text */}
     <div className="relative z-10 w-[92%] mx-auto mt-auto text-center dark:bg-white/5 bg-gray-100 px-[24px] py-[12px] rounded-2xl backdrop-blur-md border dark:border-white/10 border-gray-200/80 shadow-sm">
      <p className="text-[14px] md:text-[15px] font-medium dark:text-gray-300 text-gray-700">
       {t("processing_page_hint_prefix")}{" "}
       <span className="font-extrabold text-purple-600 dark:text-purple-400">{t("processing_page_hint_bold")}</span>
      </p>
     </div>
    </div>
   </div>
  </div>
 );
}
