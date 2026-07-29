interface ConfirmRetryModalProps {
 isOpen: boolean;
 onConfirm: () => void;
 onCancel: () => void;
}

export function ConfirmRetryModal({ isOpen, onConfirm, onCancel }: ConfirmRetryModalProps) {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
   <div className="relative flex w-[480px] flex-col items-center rounded-[24px] bg-white pt-[40px] px-[40px] pb-[40px] text-center shadow-xl overflow-hidden">
    
    {/* Icon */}
    <div className="mb-[24px] flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#fef9c3]">
     <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#dfd64a] text-white">
      <span className="text-[44px] font-bold leading-none">!</span>
     </div>
    </div>

    {/* Text */}
    <h3 className="mb-[12px] text-[36px] font-bold text-[#111]">Confirm</h3>
    <p className="mb-[40px] text-[20px] font-medium text-[#999]">Retry processing?</p>

    {/* Buttons */}
    <div className="flex w-full gap-[16px]">
     <button
      onClick={onCancel}
      className="flex-1 rounded-[16px] border-[2px] border-[#dfd64a] py-[14px] text-[18px] font-bold text-[#dfd64a] transition-colors hover:bg-[#fefce8] focus-visible:outline-none"
     >
      Cancel
     </button>
     <button
      onClick={onConfirm}
      className="flex-1 rounded-[16px] bg-[#dfd64a] py-[14px] text-[18px] font-bold text-white transition-colors hover:opacity-90 focus-visible:outline-none"
     >
      Confirm
     </button>
    </div>

    {/* Bottom accent bar */}
    <div className="absolute bottom-0 left-0 right-0 h-[20px] bg-[#fdf8b5]" />
    {/* Another darker bar right at the bottom edge */}
    <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-[#dfd64a]" />
   </div>
  </div>
 );
}
