interface ProcessingFailedModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export function ProcessingFailedModal({ isOpen, onClose }: ProcessingFailedModalProps) {
 if (!isOpen) return null;

 return (
  <div 
   className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
   onClick={onClose}
  >
   <div 
    className="relative flex w-[480px] flex-col items-center rounded-[24px] bg-white pt-[40px] px-[40px] pb-[60px] text-center shadow-xl overflow-hidden cursor-default"
    onClick={(e) => e.stopPropagation()}
   >
    
    {/* Icon */}
    <div className="mb-[24px] flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#fde9e9]">
     <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#e86664] text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-[40px] w-[40px]">
       <path d="M18 6L6 18M6 6L18 18" />
      </svg>
     </div>
    </div>

    {/* Text */}
    <h3 className="mb-[16px] text-[36px] font-bold text-[#111]">Failed</h3>
    <p className="text-[20px] font-medium text-[#999] leading-tight">Meeting processing failed. Please<br/>try again.</p>

    {/* Bottom accent bar */}
    <div className="absolute bottom-0 left-0 right-0 h-[12px] bg-gradient-to-r from-[#e86664] to-[#f49594]" />
   </div>
  </div>
 );
}
