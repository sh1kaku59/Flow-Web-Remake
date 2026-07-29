import { ChangeEvent, DragEvent, useRef, useState } from "react";
import type { SelectedFile, UploadState } from "../types";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface DropzoneAreaProps {
 uploadState: UploadState;
 selectedFile: SelectedFile | null;
 onFileSelect: (file: File) => void;
 onClearFile: () => void;
 onUploadStart: () => void;
}

export function DropzoneArea({
 uploadState,
 selectedFile,
 onFileSelect,
 onClearFile,
 onUploadStart,
}: DropzoneAreaProps) {
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [isDragOver, setIsDragOver] = useState(false);
 const { t } = useLanguage();

 const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragOver(true);
 };

 const handleDragLeave = () => setIsDragOver(false);

 const handleDrop = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragOver(false);
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
   onFileSelect(e.dataTransfer.files[0]);
  }
 };

 const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
   onFileSelect(e.target.files[0]);
  }
 };

  if (uploadState === "selected" && selectedFile) {
   return (
    <div className="relative flex h-[380px] w-[620px] max-w-[95vw] flex-col items-center justify-center rounded-[24px] border border-black/10 dark:border-white/10 dark:bg-white/5 bg-black/5 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] animate-fade-slide-in p-8 overflow-hidden group">
     {/* Ambient card glow */}
     <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none group-hover:bg-purple-500/30 transition-all duration-500" />
     <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-500" />

     <div className="relative z-10 flex flex-col items-center">
      <button
       onClick={onClearFile}
       className="absolute -left-[16px] -top-[16px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-red-600 focus-visible:outline-none z-20"
       title={t("btn_clear")}
      >
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-[16px] w-[16px]">
        <path d="M18 6L6 18M6 6L18 18" />
       </svg>
      </button>
      
      {/* Liquid animated gradient audio icon container */}
      <div className="relative flex h-[90px] w-[74px] items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 bg-[length:200%_200%] animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_30px_rgba(147,51,234,0.4)] overflow-hidden transition-transform duration-500 hover:scale-105">
       <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-transparent to-cyan-300/40 animate-[spin_8s_linear_infinite]" />
       <div className="absolute right-0 top-0 border-b-[22px] border-l-[22px] border-b-transparent border-l-white/40 backdrop-blur-sm" />
       <svg viewBox="0 0 24 24" fill="currentColor" className="h-[36px] w-[36px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] relative z-10">
        <path d="M9 18V5l12-2v13M9 9l12-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
       </svg>
      </div>
      
      <span className="mt-[16px] text-[14px] font-semibold dark:text-purple-300 text-purple-600 tracking-wider uppercase">
       {selectedFile.duration || "00:00:00"}
      </span>
      <span className="mt-[4px] text-[20px] font-bold dark:text-white text-gray-900 drop-shadow-sm max-w-[480px] truncate text-center">
       {selectedFile.name}
      </span>
     </div>

     {/* Processing button with gradient hover */}
     <button
      onClick={onUploadStart}
      className="relative z-10 mt-[24px] group/btn flex h-[52px] w-[220px] items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-[length:200%_200%] text-[16px] font-extrabold text-white shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] active:scale-[0.98] focus-visible:outline-none overflow-hidden"
     >
      <span className="relative z-10 flex items-center gap-2">
       <span>Processing</span>
      </span>
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
     </button>
    </div>
   );
  }

 return (
  <div
   className={`relative flex h-[360px] w-[600px] flex-col items-center justify-center rounded-[20px] border-[2px] border-dashed backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300 animate-fade-slide-in ${
    isDragOver 
     ? "border-purple-500 dark:bg-white/10 bg-black/10 scale-[1.02]" 
     : "dark:border-white/10 border-black/10 dark:bg-white/5 bg-black/5 hover:dark:bg-white/10 hover:bg-black/10"
   }`}
   onDragOver={handleDragOver}
   onDragLeave={handleDragLeave}
   onDrop={handleDrop}
  >
   <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    className="hidden"
    accept=".wav,.mp3,.m4a,audio/*"
   />
   
   {/* Music icon with upload badge */}
   <div className="mb-[24px] flex h-[80px] w-[80px] items-center justify-center rounded-full dark:bg-[#0A0A0A] bg-white text-[#0ea5e9] shadow-lg relative group transition-transform duration-300 hover:scale-105 border">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[40px] w-[40px] transition-transform duration-300 group-hover:scale-110">
     <path d="M9 18V5l12-2v13M9 9l12-2" />
     <circle cx="6" cy="18" r="3" />
     <circle cx="18" cy="16" r="3" />
    </svg>
    <div className="absolute -bottom-1 -right-1 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-md">
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M12 19V5M5 12l7-7 7 7" />
     </svg>
    </div>
   </div>

   <div className="text-center">
    <p className="text-[20px] font-bold dark:text-white text-gray-900 drop-shadow-sm">
     {t("dropzone_hint").split(',')[0]}
     <span className="text-[14px] font-normal dark:text-gray-400 text-gray-600 ml-2">
      (Supported WAV, MP3, M4A)
     </span>
    </p>
    <p className="my-[16px] text-[16px] font-bold dark:text-gray-500 text-gray-400">OR</p>
   </div>

   <button
    onClick={() => fileInputRef.current?.click()}
    className="btn-ripple flex h-[48px] px-[36px] items-center justify-center rounded-[14px] bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-[16px] font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-[2px] hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
   >
    {t("dropzone_idle")}
   </button>
  </div>
 );
}
