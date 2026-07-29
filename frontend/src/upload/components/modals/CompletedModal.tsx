import { useLanguage } from "../../../shared/i18n/LanguageContext";

interface CompletedModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export function CompletedModal({ isOpen, onClose }: CompletedModalProps) {
 const { t } = useLanguage();

 if (!isOpen) return null;

 return (
  <div 
   className="fixed inset-0 z-[100] flex items-center justify-center dark:bg-black/70 bg-black/50 backdrop-blur-md p-4 animate-modal-overlay"
   onClick={onClose}
  >
   <div 
    className="relative flex w-[480px] max-w-[92vw] flex-col items-center rounded-[28px] dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 pt-[48px] px-[36px] pb-[56px] text-center shadow-2xl overflow-hidden cursor-default animate-modal-content"
    onClick={(e) => e.stopPropagation()}
   >
    
    {/* Ambient Glow */}
    <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[220px] h-[220px] bg-green-500/20 rounded-full blur-[70px] pointer-events-none" />

    {/* Success Icon */}
    <div className="relative mb-[24px] flex h-[96px] w-[96px] items-center justify-center rounded-full bg-green-500/10">
     <div className="absolute inset-0 rounded-full animate-ping bg-green-500/20 opacity-75" />
     <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" className="h-[34px] w-[34px]">
       <path d="M20 6L9 17l-5-5" />
      </svg>
     </div>
    </div>

    {/* Bilingual Text Header & Description */}
    <h3 className="mb-[12px] text-[28px] md:text-[30px] font-extrabold dark:text-white text-gray-900 tracking-tight">
     {t("completed_title")}
    </h3>
    <p className="text-[16px] font-medium dark:text-gray-300 text-gray-600 max-w-sm">
     {t("completed_desc")}
    </p>

    {/* Bottom Accent Bar */}
    <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-gradient-to-r from-green-400 to-emerald-600" />
   </div>
  </div>
 );
}
