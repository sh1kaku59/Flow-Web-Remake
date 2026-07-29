import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../shared/i18n/LanguageContext";
import { Edit2, X } from "lucide-react";

interface RenameModalProps {
 isOpen: boolean;
 initialTitle: string;
 blockedTitles: string[];
 isSaving: boolean;
 onCancel: () => void;
 onConfirm: (nextTitle: string) => Promise<void>;
}

function validateTitle(
 rawValue: string,
 initialTitle: string,
 blockedTitles: string[]
): string {
 const value = rawValue.trim();
 const initial = initialTitle.trim();

 if (value.length === 0) {
  return "Title is required.";
 }

 if (value.length > 120) {
  return "Title must be 120 characters or fewer.";
 }

 if (/[\u0000-\u001f\u007f]/.test(value)) {
  return "Title contains unsupported characters.";
 }

 const normalized = value.toLowerCase();
 const hasDuplicate = blockedTitles.some(
  (title) => title.trim().toLowerCase() === normalized && title.trim().toLowerCase() !== initial.toLowerCase()
 );
 if (hasDuplicate) {
  return "A diary with this title already exists.";
 }

 return "";
}

export function RenameModal({
 isOpen,
 initialTitle,
 blockedTitles,
 isSaving,
 onCancel,
 onConfirm,
}: RenameModalProps) {
 const { t } = useLanguage();
 const [title, setTitle] = useState(initialTitle);

 useEffect(() => {
  if (!isOpen) {
   return;
  }
  setTitle(initialTitle);
 }, [initialTitle, isOpen]);

 const validationError = useMemo(
  () => validateTitle(title, initialTitle, blockedTitles),
  [blockedTitles, initialTitle, title]
 );
 const isPristine = title.trim() === initialTitle.trim();
 const disableSubmit = isSaving || isPristine || validationError !== "";

 if (!isOpen) {
  return null;
 }

 const onSubmit = async (event: FormEvent) => {
  event.preventDefault();
  if (disableSubmit) {
   return;
  }
  await onConfirm(title.trim());
 };

 const modalContent = (
  <div className="fixed inset-0 z-[100] flex items-center justify-center dark:bg-black/70 bg-black/50 backdrop-blur-md p-4 animate-modal-overlay">
   <form
    onSubmit={onSubmit}
    className="relative flex w-[480px] max-w-[92vw] flex-col rounded-[28px] dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 shadow-2xl overflow-hidden animate-modal-content"
   >
    {/* Header */}
    <div className="relative z-10 flex items-center justify-between px-7 pt-6 pb-4 border-b dark:border-white/10 border-gray-100">
     <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8c00ff] to-[#0aa9f5] text-white shadow-md">
       <Edit2 className="h-5 w-5" />
      </div>
      <h2 className="text-[20px] font-extrabold dark:text-white text-gray-900">
       {t("rename_modal_title")}
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
    <div className="px-7 py-6 space-y-4">
     <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold dark:text-gray-300 text-gray-700">
       {t("rename_modal_hint")}
      </label>
      <input
       value={title}
       onChange={(e) => setTitle(e.target.value)}
       className="w-full h-[48px] px-4 text-[15px] font-medium dark:bg-white/5 bg-gray-50 outline-none border dark:border-white/10 border-gray-200 rounded-xl dark:text-white text-gray-900 placeholder:dark:text-gray-500 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
       placeholder={t("rename_modal_hint")}
      />
     </div>
    </div>

    {/* Footer Buttons */}
    <div className="px-7 py-4 border-t dark:border-white/10 border-gray-100 dark:bg-[#161616] bg-gray-50/50 flex justify-end gap-3">
     <button
      type="button"
      onClick={onCancel}
      className="h-[44px] px-5 rounded-xl border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-white dark:text-gray-300 text-gray-700 dark:hover:bg-white/10 hover:bg-gray-100 font-semibold transition-all duration-200"
     >
      {t("btn_cancel")}
     </button>

     <button
      type="submit"
      disabled={disableSubmit}
      className={`h-[44px] px-6 rounded-xl text-[15px] font-extrabold text-white transition-all duration-200
       ${
        disableSubmit
         ? "bg-purple-400/40 opacity-60 cursor-not-allowed"
         : "bg-gradient-to-r from-[#8c00ff] to-[#0aa9f5] hover:scale-105 active:scale-[0.98] shadow-md"
       }`}
     >
      {isSaving ? "..." : t("save")}
     </button>
    </div>
   </form>
  </div>
 );

 return createPortal(modalContent, document.body);
}
