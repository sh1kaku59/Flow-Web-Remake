interface ErrorModalProps {
 isOpen: boolean;
 onClose: () => void;
 message: string;
}

export function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
   <div className="flex w-[400px] flex-col items-center rounded-[20px] bg-white p-[32px] text-center shadow-xl">
    <div className="mb-[16px] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-red-100 text-red-500">
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-[32px] w-[32px]">
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="10" />
     </svg>
    </div>
    <h3 className="mb-[8px] text-[20px] font-bold text-[#111]">Upload Error</h3>
    <p className="mb-[24px] text-[15px] text-[#555]">{message}</p>
    <button
     onClick={onClose}
     className="w-full rounded-[12px] bg-red-500 py-[12px] text-[15px] font-bold text-white transition-colors hover:bg-red-600 focus-visible:outline-none"
    >
     Close
    </button>
   </div>
  </div>
 );
}
