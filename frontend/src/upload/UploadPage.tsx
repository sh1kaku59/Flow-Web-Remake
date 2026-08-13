import { useState } from "react";
import { DropzoneArea } from "./components/DropzoneArea";
import { ProcessingView } from "./components/ProcessingView";
import { FailedModal } from "../shared/components/modals/FailedModal";
import { ConfirmRetryModal } from "./components/modals/ConfirmRetryModal";
import { UploadFailedModal } from "./components/modals/UploadFailedModal";
import { ProcessingFailedModal } from "./components/modals/ProcessingFailedModal";
import { CompletedModal } from "./components/modals/CompletedModal";
import { useLanguage } from "../shared/i18n/LanguageContext";

import type { SelectedFile, UploadState } from "./types";
import { Header } from "../diary-detail/components/Header";

export function UploadPage() {
 const { t } = useLanguage();
 const [uploadState, setUploadState] = useState<UploadState>("idle");
 const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
 const [audioDurationSec, setAudioDurationSec] = useState<number>(0);

 // Modals state
 const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
 const [errorMessage, setErrorMessage] = useState("");
 const [isConfirmRetryModalOpen, setIsConfirmRetryModalOpen] = useState(false);
 const [isUploadFailedModalOpen, setIsUploadFailedModalOpen] = useState(false);
 const [isProcessingFailedModalOpen, setIsProcessingFailedModalOpen] = useState(false);
 const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

 const handleFileSelect = (file: File) => {
  const validTypes = ["audio/wav", "audio/mpeg", "audio/x-m4a", "audio/m4a", "audio/mp4"];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a)$/i)) {
   setErrorMessage("Unsupported file format. Please upload WAV, MP3, or M4A.");
   setIsErrorModalOpen(true);
   return;
  }

  const MAX_SIZE = 500 * 1024 * 1024; // 500MB max limit
  if (file.size > MAX_SIZE) {
   setErrorMessage(t("upload_failed_desc"));
   setIsUploadFailedModalOpen(true);
   return;
  }
  
  const audio = new Audio(URL.createObjectURL(file));
  audio.onloadedmetadata = () => {
   const totalSeconds = Math.floor(audio.duration);
   setAudioDurationSec(totalSeconds);
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = totalSeconds % 60;
   const formattedDuration = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
   ].join(':');
   
   setSelectedFile({
    file,
    name: file.name,
    duration: formattedDuration
   });
   setUploadState("selected");
   URL.revokeObjectURL(audio.src);
  };
  audio.onerror = () => {
   setSelectedFile({
    file,
    name: file.name,
    duration: "Unknown"
   });
   setUploadState("selected");
   URL.revokeObjectURL(audio.src);
  };
 };

 const handleClearFile = () => {
  setSelectedFile(null);
  setUploadState("idle");
 };

 const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api/v1").replace(/\/+$/, "");

 const handleUploadStart = async () => {
  if (!selectedFile) return;
  setUploadState("uploading");
  
  try {
   const formData = new FormData();
   formData.append("file", selectedFile.file);
   
   const uploadRes = await fetch(`${API_BASE_URL}/audio/upload`, {
    method: "POST",
    body: formData
   });
   
   if (!uploadRes.ok) {
    const errorData = await uploadRes.json().catch(() => ({}));
    const detailMsg = errorData.detail || "Tải lên tệp âm thanh thất bại. Vui lòng thử lại.";
    setErrorMessage(detailMsg);
    setIsUploadFailedModalOpen(true);
    setUploadState("idle");
    return;
   }
   
   const { job_id, meeting_id } = await uploadRes.json();
   console.log("Started Job:", job_id, "Meeting:", meeting_id);
   
   // Polling
   const pollInterval = setInterval(async () => {
    try {
     const statusRes = await fetch(`${API_BASE_URL}/audio/jobs/${job_id}`);
     if (statusRes.ok) {
      const statusData = await statusRes.json();
      const pct = statusData.progress_percent || 0;
      const state = statusData.status;
      
      if (state === "Failed") {
       clearInterval(pollInterval);
       setIsProcessingFailedModalOpen(true);
       setUploadState("idle");
      } else if (state === "Completed" || pct === 100) {
       clearInterval(pollInterval);
       setUploadState("completed");
       setIsCompletedModalOpen(true);
       setTimeout(() => {
        setIsCompletedModalOpen(false);
        setUploadState("idle");
        setSelectedFile(null);
        window.history.pushState({}, "", "/diary");
        window.dispatchEvent(new PopStateEvent("popstate"));
       }, 2500);
      } else if (pct < 33) {
       setUploadState("step1");
      } else if (pct >= 33 && pct < 66) {
       setUploadState("step2");
      } else if (pct >= 66) {
       setUploadState("step3");
      }
     }
    } catch (err) {
     console.error("Polling error:", err);
    }
   }, 2000);
   
  } catch (error: any) {
   console.error(error);
   setErrorMessage(error.message || "Tải lên tệp âm thanh thất bại. Vui lòng thử lại.");
   setIsUploadFailedModalOpen(true);
   setUploadState("idle");
  }
 };

 const handleCancelProcess = () => {
  if (uploadState.startsWith("step") || uploadState === "uploading") {
   setIsConfirmRetryModalOpen(true);
  } else {
   window.history.pushState({}, "", "/");
   window.dispatchEvent(new PopStateEvent("popstate"));
  }
 };

 const confirmCancel = () => {
  setIsConfirmRetryModalOpen(false);
  setUploadState("idle");
  setSelectedFile(null);
 };

 return (
  <div className="flex h-screen flex-col overflow-hidden dark:bg-[#0A0A0A] bg-gray-50 dark:text-white text-gray-900 font-sans selection:bg-purple-500/30">
   <div className="flex-shrink-0 relative z-50">
    <Header />
   </div>

   <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden py-12">
    {/* Background Gradients & Glows */}
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
    
    <div className="relative z-20 flex flex-col items-center w-full">
     {/* Title */}
     {(uploadState === "idle" || uploadState === "selected") && (
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-normal px-4 py-1 leading-normal mt-8 mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-md animate-fade-slide-in">
       {t("upload_title")}
      </h1>
     )}
     
     <div className="w-full flex justify-center mb-8">
      {(uploadState === "idle" || uploadState === "selected") && (
       <DropzoneArea
        uploadState={uploadState}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onClearFile={handleClearFile}
        onUploadStart={handleUploadStart}
       />
      )}

      {(uploadState === "uploading" || uploadState === "step1" || uploadState === "step2" || uploadState === "step3" || uploadState === "completed") && (
       <ProcessingView uploadState={uploadState} audioDurationSec={audioDurationSec} />
      )}
     </div>


    </div>
   </div>

   <FailedModal
    isOpen={isErrorModalOpen}
    onClose={() => setIsErrorModalOpen(false)}
    message={errorMessage}
   />
   
   <ConfirmRetryModal
    isOpen={isConfirmRetryModalOpen}
    onCancel={() => setIsConfirmRetryModalOpen(false)}
    onConfirm={confirmCancel}
   />
   
   <UploadFailedModal
    isOpen={isUploadFailedModalOpen}
    onClose={() => setIsUploadFailedModalOpen(false)}
    message={errorMessage}
   />

   <ProcessingFailedModal
    isOpen={isProcessingFailedModalOpen}
    onClose={() => setIsProcessingFailedModalOpen(false)}
   />

   <CompletedModal
    isOpen={isCompletedModalOpen}
    onClose={() => setIsCompletedModalOpen(false)}
   />

  </div>
 );
}
