import React, { useState, useEffect, useRef } from "react";
import { FileText, Sparkles, Upload, CheckCircle2, AlertCircle, X, BrainCircuit, PenTool, Timer, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface ReportExportModalProps {
 isOpen: boolean;
 onClose: () => void;
 meetingId: string;
 meetingTitle: string;
}

type ModalStep = "select_option" | "upload_custom" | "processing" | "success" | "error";

export function ReportExportModal({
 isOpen,
 onClose,
 meetingId,
 meetingTitle,
}: ReportExportModalProps) {
 const { t } = useLanguage();
 const [step, setStep] = useState<ModalStep>("select_option");
 const [selectedOption, setSelectedOption] = useState<"default" | "custom">("default");
 const [customFile, setCustomFile] = useState<File | null>(null);
 const [fileError, setFileError] = useState<string>("");
 const [isDragOver, setIsDragOver] = useState(false);
 const [progress, setProgress] = useState(0);
 const [errorMessage, setErrorMessage] = useState("");
 const fileInputRef = useRef<HTMLInputElement>(null);

 // Reset state when modal opens
 useEffect(() => {
  if (isOpen) {
   setStep("select_option");
   setSelectedOption("default");
   setCustomFile(null);
   setFileError("");
   setProgress(0);
   setErrorMessage("");
  }
 }, [isOpen]);

 if (!isOpen) return null;

 const handleOptionConfirm = () => {
  if (selectedOption === "default") {
   startReportGeneration("default", null);
  } else {
   setStep("upload_custom");
  }
 };

 const handleFileSelect = (file: File) => {
  setFileError("");
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== "docx" && ext !== "pdf") {
   setFileError("Hệ thống chỉ chấp nhận tệp .docx hoặc .pdf");
   return;
  }
  if (file.size > 100 * 1024 * 1024) {
   setFileError("Dung lượng tệp vượt quá giới hạn 100MB");
   return;
  }
  setCustomFile(file);
 };

 const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragOver(false);
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
   handleFileSelect(e.dataTransfer.files[0]);
  }
 };

 const startReportGeneration = async (type: "default" | "custom", file: File | null) => {
  setStep("processing");
  setProgress(5);

  const progressInterval = setInterval(() => {
   setProgress((prev) => {
    if (prev < 40) return prev + 12;
    if (prev < 75) return prev + 6;
    if (prev < 92) return prev + 2;
    return prev;
   });
  }, 400);

  try {
   const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1").replace(/\/+$/, "");
   const formData = new FormData();
   formData.append("template_type", type);
   if (type === "custom" && file) {
    formData.append("custom_template", file);
   }

   const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/export-report`, {
    method: "POST",
    body: formData,
   });

   clearInterval(progressInterval);

   if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Không thể tạo báo cáo PDF từ máy chủ.");
   }

   setProgress(100);
   const blob = await res.blob();
   
   // Auto-download PDF file
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   const safeTitle = meetingTitle.replace(/[^a-zA-Z0-9_-]/g, "_");
   a.download = `Meeting_Report_${safeTitle}.pdf`;
   document.body.appendChild(a);
   a.click();
   window.URL.revokeObjectURL(url);
   document.body.removeChild(a);

   setTimeout(() => {
    setStep("success");
    setTimeout(() => {
     onClose();
    }, 2000);
   }, 500);

  } catch (err: any) {
   clearInterval(progressInterval);
   console.error("Report generation failed:", err);
   setErrorMessage(err.message || "Tạo báo cáo thất bại. Vui lòng thử lại.");
   setStep("error");
  }
 };

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dark:bg-black/70 bg-black/50 backdrop-blur-md animate-fade-in">
   <div className="relative w-full max-w-[620px] rounded-[28px] border dark:border-white/10 border-gray-200 dark:bg-[#121212] bg-white dark:text-white text-gray-900 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl overflow-hidden animate-scale-up">
    {/* Ambient background glows */}
    <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full dark:bg-purple-600/20 bg-purple-500/10 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full dark:bg-cyan-600/20 bg-cyan-500/10 blur-3xl pointer-events-none" />

    {/* Close button */}
    <button
     onClick={onClose}
     className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full dark:bg-white/5 bg-gray-100 dark:text-gray-400 text-gray-600 transition-colors hover:dark:bg-white/10 hover:bg-gray-200 hover:dark:text-white hover:text-gray-900 z-20"
    >
     <X className="h-5 w-5" />
    </button>

    {/* STEP 1: Select Option */}
    {step === "select_option" && (
     <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
       <FileText className="h-7 w-7" />
      </div>

      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 mb-2">
       {t("export_report_title")}
      </h3>
      <p className="text-sm dark:text-gray-400 text-gray-600 mb-6 max-w-md">
       {t("export_report_subtitle")}
      </p>

      <div className="flex flex-col gap-4 w-full mb-8">
       {/* Option A: System Standard Template */}
       <div
        onClick={() => setSelectedOption("default")}
        className={`group relative flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
         selectedOption === "default"
          ? "border-purple-500 dark:bg-purple-500/15 bg-purple-50/90 shadow-[0_0_25px_rgba(168,85,247,0.25)]"
          : "dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
        }`}
       >
        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
         selectedOption === "default" ? "border-purple-500 bg-purple-500 text-white" : "border-gray-400 bg-transparent"
        }`}>
         {selectedOption === "default" && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
        <div className="flex flex-col text-left">
         <span className="text-base font-bold dark:text-white text-gray-900 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
          {t("opt_system_title")}
         </span>
         <span className="text-xs dark:text-gray-400 text-gray-600 mt-1 leading-relaxed">
          {t("opt_system_desc")}
         </span>
        </div>
       </div>

       {/* Option B: Custom User Template */}
       <div
        onClick={() => setSelectedOption("custom")}
        className={`group relative flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
         selectedOption === "custom"
          ? "border-cyan-500 dark:bg-cyan-500/15 bg-cyan-50/90 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
          : "dark:border-white/10 border-gray-200 dark:bg-white/5 bg-gray-50 hover:border-cyan-300 hover:bg-cyan-50/50"
        }`}
       >
        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
         selectedOption === "custom" ? "border-cyan-500 bg-cyan-500 text-white" : "border-gray-400 bg-transparent"
        }`}>
         {selectedOption === "custom" && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
        <div className="flex flex-col text-left">
         <span className="text-base font-bold dark:text-white text-gray-900 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
          {t("opt_custom_title")}
         </span>
         <span className="text-xs dark:text-gray-400 text-gray-600 mt-1 leading-relaxed">
          {t("opt_custom_desc")}
         </span>
        </div>
       </div>
      </div>

      <button
       onClick={handleOptionConfirm}
       className="w-full flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8c00ff] via-[#3b82f6] to-[#0aa9f5] text-lg font-extrabold text-white shadow-[0_0_30px_rgba(140,0,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(6,182,212,0.6)] active:scale-[0.98]"
      >
       <span>{t("btn_confirm")}</span>
       <ArrowRight className="h-5 w-5" />
      </button>
     </div>
    )}

    {/* STEP 2: Upload Custom Template */}
    {step === "upload_custom" && (
     <div className="flex flex-col items-center text-center">
      <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">{t("upload_custom_title")}</h3>
      <p className="text-xs dark:text-gray-400 text-gray-600 mb-6">
       {t("upload_custom_subtitle")}
      </p>

      <div
       onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
       onDragLeave={() => setIsDragOver(false)}
       onDrop={handleDrop}
       onClick={() => fileInputRef.current?.click()}
       className={`relative w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 mb-4 ${
        isDragOver
         ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
         : customFile
          ? "border-emerald-500/50 bg-emerald-500/10"
          : "dark:border-white/15 border-gray-300 dark:bg-white/5 bg-gray-50 hover:dark:border-white/30 hover:border-gray-400 hover:dark:bg-white/10 hover:bg-gray-100"
       }`}
      >
       <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
        accept=".docx,.pdf"
       />

       {customFile ? (
        <div className="flex flex-col items-center gap-2">
         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
          <FileText className="h-7 w-7" />
         </div>
         <span className="text-base font-bold dark:text-white text-gray-900 max-w-[380px] truncate">{customFile.name}</span>
         <span className="text-xs text-emerald-600 font-medium">{(customFile.size / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
       ) : (
        <div className="flex flex-col items-center gap-3">
         <div className="flex h-14 w-14 items-center justify-center rounded-2xl dark:bg-white/10 bg-gray-200 text-cyan-500">
          <Upload className="h-7 w-7" />
         </div>
         <span className="text-sm font-bold dark:text-gray-200 text-gray-800">{t("drag_custom_hint")}</span>
         <span className="text-xs dark:text-gray-500 text-gray-600">{t("drag_custom_subhint")}</span>
        </div>
       )}
      </div>

      {fileError && <p className="text-xs font-semibold text-red-500 mb-4">{fileError}</p>}

      <div className="flex items-center gap-4 w-full mt-4">
       <button
        onClick={() => setStep("select_option")}
        className="flex-1 flex h-14 items-center justify-center gap-2 rounded-2xl border dark:border-white/15 border-gray-300 dark:bg-white/5 bg-gray-100 text-base font-bold dark:text-gray-200 text-gray-800 hover:dark:bg-white/10 hover:bg-gray-200 transition-all duration-200"
       >
        <ArrowLeft className="h-5 w-5 dark:text-gray-300 text-gray-700" />
        <span>{t("back")}</span>
       </button>
       <button
        onClick={() => customFile && startReportGeneration("custom", customFile)}
        disabled={!customFile}
        className="flex-[2] flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8c00ff] via-[#3b82f6] to-[#0aa9f5] text-base font-extrabold text-white shadow-[0_0_30px_rgba(140,0,255,0.4)] disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all duration-300"
       >
        <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
        <span>{t("btn_process_report")}</span>
       </button>
      </div>
     </div>
    )}

    {/* STEP 3: AI Processing State */}
    {step === "processing" && (
     <div className="flex flex-col items-center text-center pt-6 pb-2">
      <div className="relative flex items-center justify-center mb-8 mt-2">
       <div className="absolute inset-[-30%] animate-[spin_5s_linear_infinite] rounded-full border-2 border-dashed border-purple-500/60 dark:border-purple-400/40" />
       <div className="absolute inset-[-50%] animate-[spin_8s_linear_infinite_reverse] rounded-full border-2 border-dotted border-cyan-500/60 dark:border-cyan-400/30" />
       
       <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl dark:bg-gradient-to-br dark:from-purple-600/40 dark:to-cyan-600/40 bg-gradient-to-br from-purple-200 via-indigo-100 to-cyan-200 border dark:border-white/20 border-purple-300 backdrop-blur-xl shadow-[0_0_35px_rgba(140,0,255,0.35)]">
        <BrainCircuit className="h-14 w-14 text-purple-600 dark:text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] animate-pulse" />
        <PenTool className="absolute top-2 right-2 h-7 w-7 text-cyan-600 dark:text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-bounce" />
        <Sparkles className="absolute bottom-2 left-2 h-6 w-6 text-amber-500 dark:text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse" />
       </div>
      </div>

      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 mb-2">
       {t("ai_processing_title")}
      </h3>
      <p className="text-xs dark:text-gray-400 text-gray-600 mb-6 max-w-md">
       {t("ai_processing_subtitle")}
      </p>

      {/* Real-time Progress Bar & Percentage */}
      <div className="w-full max-w-md dark:bg-black/40 bg-gray-100 rounded-full h-4 p-1 border dark:border-white/10 border-gray-300 overflow-hidden relative mb-3">
       <div
        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.8)]"
        style={{ width: `${progress}%` }}
       />
      </div>

      <div className="flex items-center gap-2 text-sm font-extrabold text-cyan-600 dark:text-cyan-300 mb-2">
       <div className="relative h-4 w-4 shrink-0 text-cyan-400">
        {/* Fixed Clock Dial */}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
         <circle cx="12" cy="12" r="9" />
         <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
        {/* Rotating Clock Needle ONLY */}
        <svg className="absolute inset-0 h-4 w-4 animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
         <line x1="12" y1="12" x2="12" y2="6.5" />
        </svg>
       </div>
       <span>{progress}% {t("pct_completed")}</span>
      </div>
     </div>
    )}

    {/* STEP 4: Success State */}
    {step === "success" && (
     <div className="flex flex-col items-center text-center py-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
       <CheckCircle2 className="h-10 w-10" />
      </div>
      <h3 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">{t("export_success_title")}</h3>
      <p className="text-sm dark:text-gray-300 text-gray-700">{t("export_success_subtitle")}</p>
     </div>
    )}

    {/* STEP 5: Error State */}
    {step === "error" && (
     <div className="flex flex-col items-center text-center py-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
       <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-2">{t("export_failed_title")}</h3>
      <p className="text-xs dark:text-gray-400 text-gray-600 mb-6">{errorMessage}</p>
      <button
       onClick={() => setStep("select_option")}
       className="px-6 py-2.5 rounded-xl dark:bg-white/10 bg-gray-200 text-sm font-bold dark:text-white text-gray-900 hover:dark:bg-white/20 hover:bg-gray-300 transition-colors"
      >
       {t("retry")}
      </button>
     </div>
    )}
   </div>
  </div>
 );
}
