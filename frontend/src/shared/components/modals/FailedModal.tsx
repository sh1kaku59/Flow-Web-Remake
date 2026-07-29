import { useEffect } from "react";

interface FailedModalProps {
 isOpen: boolean;
 onClose: () => void;
 message: string;
 autoCloseMs?: number;
}

export function FailedModal({ isOpen, onClose, message, autoCloseMs = 4000 }: FailedModalProps) {
 useEffect(() => {
  if (isOpen && autoCloseMs > 0) {
   const timer = setTimeout(() => {
    onClose();
   }, autoCloseMs);
   return () => clearTimeout(timer);
  }
 }, [isOpen, onClose, autoCloseMs]);

 if (!isOpen) return null;

 return (
  <div 
   className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-modal-overlay"
   onClick={onClose}
  >
   <div 
    className="relative flex w-[480px] flex-col items-center rounded-[32px] bg-white pt-[48px] px-[40px] pb-[64px] text-center shadow-2xl animate-modal-content cursor-default"
    onClick={(e) => e.stopPropagation()}
   >
    
    {/* Animated Cross Icon */}
    <div className="mb-[32px] flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#f9dbdb] animate-[pulse_2s_ease-in-out_infinite]">
     <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-[#e86b6b] text-white shadow-sm relative">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="h-[48px] w-[48px]">
       <path d="M18 6L6 18" strokeDasharray="24" strokeDashoffset="24" className="animate-[draw-cross_0.3s_ease-out_forwards]" />
       <path d="M6 6l12 12" strokeDasharray="24" strokeDashoffset="24" className="animate-[draw-cross_0.3s_ease-out_forwards_0.2s]" />
       <style>{`
        @keyframes draw-cross {
         to { stroke-dashoffset: 0; }
        }
       `}</style>
      </svg>
     </div>
    </div>

    {/* Text */}
    <h3 className="mb-[16px] text-[40px] font-extrabold text-[#000]">Failed</h3>
    <p className="text-[22px] font-medium text-[#888] leading-tight whitespace-pre-line">{message}</p>

    {/* Rounded Bottom accent bar */}
    <div className="absolute bottom-[24px] left-[32px] right-[32px] h-[18px] rounded-full bg-[#f28585]" />
   </div>
  </div>
 );
}
