import { useLanguage } from "../../../shared/i18n/LanguageContext";

interface UploadFailedModalProps {
 isOpen: boolean;
 onClose: () => void;
 message?: string;
}

export function UploadFailedModal({ isOpen, onClose, message }: UploadFailedModalProps) {
 const { t } = useLanguage();
 if (!isOpen) return null;

 return (
  <div 
   className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
   onClick={onClose}
  >
   <div 
    className="relative flex w-[520px] max-w-[90vw] flex-col items-center rounded-[24px] dark:bg-[#121212] bg-white pt-[40px] px-[32px] pb-[48px] text-center shadow-2xl overflow-hidden cursor-default border dark:border-white/10 border-gray-200 animate-scale-up"
    onClick={(e) => e.stopPropagation()}
   >
    
    {/* Icon */}
    <div className="mb-[24px] flex h-[90px] w-[90px] items-center justify-center rounded-full bg-[#fde9e9] dark:bg-red-500/20 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
     <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#e86664] text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-[36px] w-[36px]">
       <path d="M18 6L6 18M6 6L18 18" />
      </svg>
     </div>
    </div>

    {/* Text */}
    <h3 className="mb-[12px] text-[30px] font-bold dark:text-white text-gray-900">{t("failed")}</h3>
    <p className="text-[15px] font-medium leading-relaxed dark:text-gray-300 text-gray-700 max-w-md">
     {message || t("upload_failed_desc")}
    </p>

    <button
     type="button"
     onClick={onClose}
     className="mt-[28px] rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-[28px] py-[10px] text-[15px] font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
    >
     {t("close")}
    </button>

    {/* Bottom accent bar */}
    <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-gradient-to-r from-[#e86664] to-[#f49594]" />
   </div>
  </div>
 );
}
