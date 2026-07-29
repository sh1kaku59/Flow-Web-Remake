interface ConfirmModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 message: string;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
 if (!isOpen) return null;

 return (
  <div 
   className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-modal-overlay"
   onClick={onClose}
  >
   <div 
    className="relative flex w-[480px] flex-col items-center rounded-[32px] bg-white pt-[48px] px-[40px] pb-[72px] text-center shadow-2xl animate-modal-content cursor-default"
    onClick={(e) => e.stopPropagation()}
   >
    
    {/* Animated Exclamation Icon */}
    <div className="mb-[24px] flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#fcf8d4] animate-[pulse_2s_ease-in-out_infinite]">
     <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#dfcf3f] text-white shadow-md relative overflow-hidden">
      <div className="flex flex-col items-center justify-center animate-[bounce-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
       <div className="h-[24px] w-[6px] bg-white rounded-[3px] mb-[6px]" />
       <div className="h-[6px] w-[6px] bg-white rounded-full" />
      </div>
      <style>{`
       @keyframes bounce-in {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
       }
      `}</style>
     </div>
    </div>

    {/* Text */}
    <h3 className="mb-[16px] text-[36px] font-bold text-[#111]">Confirm</h3>
    <p className="text-[20px] font-bold text-[#999] mb-[40px]">{message}</p>

    {/* Action Buttons */}
    <div className="flex w-full gap-[16px] justify-center relative z-10">
     <button
      onClick={onClose}
      className="flex-1 rounded-[16px] border-[2px] border-[#dfcf3f] bg-white py-[14px] text-[18px] font-bold text-[#dfcf3f] transition-all hover:bg-[#fcf8d4] focus-visible:outline-none"
     >
      Cancel
     </button>
     <button
      onClick={() => {
       onConfirm();
       onClose();
      }}
      className="flex-1 rounded-[16px] bg-[#dfcf3f] py-[14px] text-[18px] font-bold text-white transition-all hover:bg-[#d4c538] hover:shadow-lg focus-visible:outline-none"
     >
      Confirm
     </button>
    </div>

    {/* Rounded Bottom accent bar */}
    <div className="absolute bottom-[24px] left-[32px] right-[32px] h-[16px] rounded-full bg-gradient-to-r from-[#e3d452] to-[#eee065] shadow-sm" />
   </div>
  </div>
 );
}
