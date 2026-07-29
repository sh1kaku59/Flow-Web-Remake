import { UserIcon } from "../../../diary-detail/components/icons";

interface PreviewTranscriptModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export function PreviewTranscriptModal({ isOpen, onClose }: PreviewTranscriptModalProps) {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-[20px] md:p-[40px]">
   <div className="relative flex h-full max-h-[85vh] w-full max-w-[800px] flex-col rounded-[24px] bg-[#121212] border border-white/10 shadow-2xl overflow-hidden animate-fade-slide-in">
    
    {/* Header */}
    <div className="flex flex-col px-[32px] pt-[32px] pb-[20px]">
     <div className="flex items-center justify-between">
      <h2 className="text-[28px] font-bold text-white tracking-tight">Preview Transcript</h2>
      <button
       onClick={onClose}
       className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-none transition-colors"
       aria-label="Close"
      >
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px]">
        <path d="M18 6L6 18M6 6L18 18" />
       </svg>
      </button>
     </div>
     <p className="mt-[8px] text-[15px] text-gray-400 leading-relaxed">
      You're viewing a preview of your transcript. To explore the full content, advanced insights, and accessibility features, head to the <span className="text-purple-400 font-medium">Diary</span> page.
     </p>
    </div>

    {/* Scrollable Transcript List */}
    <div className="flex-1 overflow-y-auto px-[32px] pb-[20px] scrollbar-hide">
     <div className="flex flex-col gap-[16px]">
      {/* Segment 1 */}
      <div className="flex flex-col rounded-[16px] bg-white/5 border border-white/5 p-[20px] hover:bg-white/10 transition-colors">
       <div className="mb-[12px] flex justify-center">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-gray-300">00:00 - 00:05</span>
       </div>
       <div className="flex items-start gap-[12px]">
        <div className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-lg">
         <UserIcon className="h-[20px] w-[20px]" />
        </div>
        <div className="flex-1 pt-[6px]">
         <span className="font-semibold text-gray-200 mr-[8px]">John:</span>
         <span className="text-gray-400">Lorem Ipsum is simply dummy text.</span>
        </div>
       </div>
      </div>

      {/* Segment 2 */}
      <div className="flex flex-col rounded-[16px] bg-white/5 border border-white/5 p-[20px] hover:bg-white/10 transition-colors">
       <div className="mb-[12px] flex justify-center">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-gray-300">00:06 - 00:29</span>
       </div>
       <div className="flex items-start gap-[12px]">
        <div className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
         <UserIcon className="h-[20px] w-[20px]" />
        </div>
        <div className="flex-1 pt-[6px]">
         <span className="font-semibold text-gray-200 mr-[8px]">Joe:</span>
         <span className="text-gray-400 leading-relaxed">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
         </span>
        </div>
       </div>
      </div>

      {/* Segment 3 */}
      <div className="flex flex-col rounded-[16px] bg-white/5 border border-white/5 p-[20px] hover:bg-white/10 transition-colors">
       <div className="mb-[12px] flex justify-center">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-gray-300">00:30 - 00:40</span>
       </div>
       <div className="flex items-start gap-[12px]">
        <div className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-lg">
         <UserIcon className="h-[20px] w-[20px]" />
        </div>
        <div className="flex-1 pt-[6px]">
         <span className="font-semibold text-gray-200 mr-[8px]">John:</span>
         <span className="text-gray-400">Lorem Ipsum is simply dummy text.</span>
        </div>
       </div>
      </div>

      {/* Segment 4 */}
      <div className="flex flex-col rounded-[16px] bg-white/5 border border-white/5 p-[20px] hover:bg-white/10 transition-colors">
       <div className="mb-[12px] flex justify-center">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-gray-300">00:41 - 01:00</span>
       </div>
       <div className="flex items-start gap-[12px]">
        <div className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
         <UserIcon className="h-[20px] w-[20px]" />
        </div>
        <div className="flex-1 pt-[6px]">
         <span className="font-semibold text-gray-200 mr-[8px]">Jane:</span>
         <span className="text-gray-400 leading-relaxed">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
         </span>
        </div>
       </div>
      </div>
     </div>
    </div>

    {/* Audio Player Bar */}
    <div className="bg-[#1a1a1a] px-[32px] py-[24px] border-t border-white/5 relative z-10 flex flex-col gap-[16px]">
     <div className="flex items-center gap-[16px]">
      <span className="text-[13px] font-medium text-gray-400">00:00</span>
      <div className="relative flex-1 h-[6px] rounded-full bg-white/10 overflow-hidden cursor-pointer">
       <div className="absolute left-0 top-0 h-full w-1/4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
      </div>
      <span className="text-[13px] font-medium text-gray-400">10:00</span>
     </div>
     <div className="flex justify-center">
      <button className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-none">
       <svg viewBox="0 0 24 24" fill="currentColor" className="h-[24px] w-[24px] ml-1">
        <path d="M8 5v14l11-7z" />
       </svg>
      </button>
     </div>
    </div>

   </div>
  </div>
 );
}
