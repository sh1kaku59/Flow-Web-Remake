interface CancelConfirmModalProps {
 isOpen: boolean;
 onConfirm: () => void;
 onCancel: () => void;
}

export function CancelConfirmModal({ isOpen, onConfirm, onCancel }: CancelConfirmModalProps) {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
   <div className="flex w-[400px] flex-col items-center rounded-[20px] bg-white p-[32px] text-center shadow-xl">
    <div className="mb-[16px] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-orange-100 text-orange-500">
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-[32px] w-[32px]">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
     </svg>
    </div>
    <h3 className="mb-[8px] text-[20px] font-bold text-[#111]">Cancel Processing?</h3>
    <p className="mb-[24px] text-[15px] text-[#555]">
     Are you sure you want to cancel the upload and processing of your meeting audio? This action cannot be undone.
    </p>
    <div className="flex w-full gap-[12px]">
     <button
      onClick={onCancel}
      className="flex-1 rounded-[12px] bg-gray-100 py-[12px] text-[15px] font-bold text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-none"
     >
      Keep Processing
     </button>
     <button
      onClick={onConfirm}
      className="flex-1 rounded-[12px] bg-red-500 py-[12px] text-[15px] font-bold text-white transition-colors hover:bg-red-600 focus-visible:outline-none"
     >
      Cancel Upload
     </button>
    </div>
   </div>
  </div>
 );
}
