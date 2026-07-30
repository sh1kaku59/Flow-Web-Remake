import { FormEvent, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { UploadCloud, X, Mic } from "lucide-react";
import { useLanguage } from "../../../shared/i18n/LanguageContext";

interface AddSampleModalProps {
 isOpen: boolean;
 onCancel: () => void;
 onAdd: (name: string, file: File | null) => void;
 initialData?: { id: string; name: string; fileName?: string };
}

export function AddSampleModal({ isOpen, onCancel, onAdd, initialData }: AddSampleModalProps) {
 const { t } = useLanguage();
 const [name, setName] = useState("");
 const [selectedFile, setSelectedFile] = useState<File | null>(null);
 const [existingFileName, setExistingFileName] = useState<string | undefined>("");
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [isDragOver, setIsDragOver] = useState(false);
 
 useEffect(() => {
  if (isOpen) {
   if (initialData) {
    setName(initialData.name);
    setExistingFileName(initialData.fileName || `${initialData.name}_sample.wav`);
    setSelectedFile(null);
   } else {
    setName("");
    setExistingFileName("");
    setSelectedFile(null);
   }
  }
 }, [isOpen, initialData]);

 if (!isOpen) return null;

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
   setSelectedFile(e.target.files[0]);
  }
 };

 const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragOver(true);
 };

 const handleDragLeave = () => {
  setIsDragOver(false);
 };

 const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragOver(false);
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
   setSelectedFile(e.dataTransfer.files[0]);
  }
 };

 const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  if (!name.trim() || (!selectedFile && !existingFileName)) return;
  onAdd(name.trim(), selectedFile);
  setName("");
  setSelectedFile(null);
  setExistingFileName("");
 };

 const isFormValid = name.trim().length > 0 && (selectedFile !== null || !!existingFileName);
 const isEditMode = !!initialData;

 const modalContent = (
  <div className="fixed inset-0 z-[100] flex items-center justify-center dark:bg-black/70 bg-black/50 backdrop-blur-md p-4 animate-modal-overlay">
   <form
    onSubmit={handleSubmit}
    className="relative flex w-[520px] max-w-[92vw] flex-col rounded-[28px] dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 shadow-2xl overflow-hidden animate-modal-content"
   >
    {/* Header */}
    <div className="relative z-10 flex items-center justify-between px-7 pt-6 pb-4 border-b dark:border-white/10 border-gray-100">
     <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8c00ff] to-[#0aa9f5] text-white shadow-md">
       <Mic className="h-5 w-5" />
      </div>
      <h2 className="text-[20px] font-extrabold dark:text-white text-gray-900">
       {isEditMode ? t("edit_sample") : t("add_sample")}
      </h2>
     </div>
     <button
      type="button"
      onClick={onCancel}
      className="flex h-8 w-8 items-center justify-center rounded-full dark:bg-white/10 bg-gray-100 dark:hover:bg-white/20 hover:bg-gray-200 dark:text-gray-400 text-gray-600 transition-colors"
     >
      <X className="h-4 w-4" />
     </button>
    </div>

    {/* Body */}
    <div className="px-7 py-6 space-y-5">
     <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold dark:text-gray-300 text-gray-700">
       {t("speaker_name")}
      </label>
      <input
       value={name}
       onChange={(e) => setName(e.target.value)}
       className="w-full h-[48px] px-4 text-[15px] font-medium dark:bg-white/5 bg-gray-50 outline-none border dark:border-white/10 border-gray-200 rounded-xl dark:text-white text-gray-900 placeholder:dark:text-gray-500 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
       placeholder="e.g. Minhbe, Khánh lê, Đức..."
      />
     </div>

     <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold dark:text-gray-300 text-gray-700">
       {t("audio_file")}
      </label>
      <div
       onDragOver={handleDragOver}
       onDragLeave={handleDragLeave}
       onDrop={handleDrop}
       onClick={() => fileInputRef.current?.click()}
       className={`w-full min-h-[140px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-6 text-center group relative overflow-hidden ${
        isDragOver
         ? "border-purple-500 bg-purple-500/15 shadow-[0_0_30px_rgba(168,85,247,0.35)] scale-[1.02]"
         : "dark:border-white/20 border-gray-300 dark:bg-white/5 bg-gray-50 hover:border-purple-500/80 hover:bg-purple-500/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:scale-[1.01]"
       }`}
      >
       <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
       />
       {selectedFile || existingFileName ? (
        <div className="flex flex-col items-center gap-2">
         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
          <UploadCloud className="w-6 h-6" />
         </div>
         <span className="dark:text-gray-200 text-gray-800 font-bold text-[15px]">
          {selectedFile ? selectedFile.name : existingFileName}
         </span>
         <button
          type="button"
          onClick={(e) => {
           e.stopPropagation();
           setSelectedFile(null);
           setExistingFileName("");
          }}
          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors mt-1"
         >
          {t("btn_clear")}
         </button>
        </div>
       ) : (
        <div className="flex flex-col items-center gap-2">
         <div className="w-12 h-12 rounded-full dark:bg-white/10 bg-purple-100 flex items-center justify-center">
          <UploadCloud className="w-6 h-6 text-purple-600 dark:text-purple-300" />
         </div>
         <span className="text-sm font-semibold dark:text-gray-300 text-gray-700">
          {t("drag_custom_hint")}
         </span>
         <span className="text-xs dark:text-gray-500 text-gray-500">
          WAV, MP3, M4A
         </span>
        </div>
       )}
      </div>
     </div>
    </div>

    {/* Footer */}
    <div className="px-7 py-4 border-t dark:border-white/10 border-gray-100 dark:bg-[#161616] bg-gray-50/50 flex justify-end gap-3">
     <button
      type="button"
      onClick={onCancel}
      className="h-[44px] px-5 rounded-xl border dark:border-white/10 border-gray-200/80 dark:bg-white/5 bg-white text-[14px] font-bold dark:text-gray-300 text-gray-700 transition-all duration-200 hover:dark:bg-white/10 hover:bg-gray-100"
     >
      {t("btn_cancel")}
     </button>
     <button
      type="submit"
      disabled={!isFormValid}
      className={`h-[44px] px-6 rounded-xl text-[14px] font-extrabold transition-all duration-200
       ${
        !isFormValid
         ? "dark:bg-white/10 bg-gray-200 dark:text-white/30 text-gray-400 cursor-not-allowed"
         : "bg-gradient-to-r from-[#8c00ff] via-[#3b82f6] to-[#0aa9f5] text-white shadow-[0_0_15px_rgba(140,0,255,0.3)] hover:scale-105 active:scale-95"
       }`}
     >
      {t("btn_save")}
     </button>
    </div>
   </form>
  </div>
 );

 return createPortal(modalContent, document.body);
}
