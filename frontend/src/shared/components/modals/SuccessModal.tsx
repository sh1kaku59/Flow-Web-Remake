import { useEffect } from "react";

interface SuccessModalProps {
 isOpen: boolean;
 onClose: () => void;
 message: string;
 autoCloseMs?: number;
}

export function SuccessModal({ isOpen, onClose, message, autoCloseMs = 3000 }: SuccessModalProps) {
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
    
    {/* Animated Check Icon */}
    <div className="mb-[32px] flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#e1fbee] animate-[pulse_2s_ease-in-out_infinite]">
     <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-[#6ce8a9] text-white shadow-sm">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="h-[48px] w-[48px] animate-[dash_0.5s_ease-out_forwards]">
       <path d="M20 6L9 17l-5-5" strokeDasharray="40" strokeDashoffset="40" className="animate-[draw-check_0.5s_ease-out_forwards_0.2s]" />
       <style>{`
        @keyframes draw-check {
         to { stroke-dashoffset: 0; }
        }
       `}</style>
      </svg>
     </div>
    </div>

    {/* Text */}
    <h3 className="mb-[16px] text-[40px] font-extrabold text-[#000]">Completed</h3>
    <p className="text-[22px] font-medium text-[#888] leading-tight whitespace-pre-line">{message}</p>

    {/* Rounded Bottom accent bar */}
    <div className="absolute bottom-[24px] left-[32px] right-[32px] h-[18px] rounded-full bg-[#6ce8a9]" />
   </div>
  </div>
 );
}
