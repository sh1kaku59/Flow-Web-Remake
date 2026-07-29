import { useState } from "react";
import { Upload, BookOpen, Settings, Mic } from "lucide-react";
import { SettingsModal } from "../../settings/SettingsModal";
import { VoiceSamplesListModal } from "../../upload/components/modals/VoiceSamplesListModal";
import { useLanguage } from "../../shared/i18n/LanguageContext";

export function Header() {
 const [isSettingsOpen, setIsSettingsOpen] = useState(false);
 const [isVoiceSamplesOpen, setIsVoiceSamplesOpen] = useState(false);
 const { t } = useLanguage();

 const navigateToUpload = () => {
  window.history.pushState({}, "", "/upload");
  window.dispatchEvent(new PopStateEvent("popstate"));
 };

 const navigateToDiary = () => {
  window.history.pushState({}, "", "/diary");
  window.dispatchEvent(new PopStateEvent("popstate"));
 };

 return (
  <header className="h-[72px] border-b dark:border-white/10 border-black/10 dark:bg-[#0A0A0A]/80 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
   <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-8">
    <div className="flex h-[32px] items-center gap-3 cursor-pointer" onClick={() => {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }}>
     <img
      src="/flow-logo.svg"
      alt="FLOW"
      className="h-[32px] w-auto object-contain transition-transform hover:scale-105"
     />
    </div>

    <div className="flex items-center gap-4">
      <button
       type="button"
       onClick={navigateToUpload}
       className="group flex h-10 items-center justify-center gap-2 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 px-5 text-sm font-medium dark:text-white text-gray-900 transition-all hover:dark:bg-white/10 hover:bg-black/10 hover:dark:border-white/20 hover:border-black/20 hover:shadow-[0_0_20px_rgba(143,98,255,0.1)]"
      >
       <Upload className="h-4 w-4 dark:text-gray-400 text-gray-600 group-hover:dark:text-white group-hover:text-gray-900 transition-colors" />
       {t("upload_title").split(" ")[0]} 
      </button>
     
      <button
       type="button"
       onClick={navigateToDiary}
       className="group flex h-10 items-center justify-center gap-2 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 px-5 text-sm font-medium dark:text-white text-gray-900 transition-all hover:dark:bg-white/10 hover:bg-black/10 hover:dark:border-white/20 hover:border-black/20 hover:shadow-[0_0_20px_rgba(143,98,255,0.1)]"
      >
       <BookOpen className="h-4 w-4 dark:text-gray-400 text-gray-600 group-hover:dark:text-white group-hover:text-gray-900 transition-colors" />
       {t("diary_title").split(" ")[0]}
      </button>

      <button
       type="button"
       onClick={() => setIsVoiceSamplesOpen(true)}
       className="group flex h-10 items-center justify-center gap-2 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 px-5 text-sm font-medium dark:text-white text-gray-900 transition-all hover:dark:bg-white/10 hover:bg-black/10 hover:dark:border-white/20 hover:border-black/20 hover:shadow-[0_0_20px_rgba(143,98,255,0.1)]"
      >
       <Mic className="h-4 w-4 dark:text-gray-400 text-gray-600 group-hover:dark:text-white group-hover:text-gray-900 transition-colors" />
       {t("voice_samples")}
      </button>

     <div className="w-px h-6 dark:bg-white/10 bg-black/10 mx-2" />

      <button
       type="button"
       onClick={() => setIsSettingsOpen(true)}
       className="group flex h-10 w-10 items-center justify-center rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 transition-all hover:dark:bg-white/10 hover:bg-black/10 hover:dark:border-white/20 hover:border-black/20 hover:shadow-[0_0_20px_rgba(143,98,255,0.1)]"
       aria-label="Settings"
      >
       <Settings className="h-4 w-4 dark:text-gray-400 text-gray-600 group-hover:dark:text-white group-hover:text-gray-900 group-hover:rotate-45 transition-all duration-300" />
      </button>
    </div>
   </div>
   
   <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
   <VoiceSamplesListModal isOpen={isVoiceSamplesOpen} onClose={() => setIsVoiceSamplesOpen(false)} />
  </header>
 );
}
