import { X, Settings as SettingsIcon, Globe, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../shared/i18n/LanguageContext";

interface SettingsModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
 const [theme, setTheme] = useState<'light' | 'dark'>('dark');
 const { language, setLanguage, t } = useLanguage();

 // Sync with local storage for theme
 useEffect(() => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (savedTheme) setTheme(savedTheme);
 }, []);

 const handleThemeChange = (newTheme: 'light' | 'dark') => {
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  if (newTheme === 'dark') {
   document.documentElement.classList.add('dark');
  } else {
   document.documentElement.classList.remove('dark');
  }
 };

 if (!isOpen) return null;

 return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center font-sans">
   <div 
    className="absolute inset-0 bg-black/70 backdrop-blur-md animate-modal-overlay" 
    onClick={onClose}
   />
   
   <div className="relative w-full max-w-md dark:bg-[#121212] bg-white border dark:border-white/10 border-black/10 rounded-3xl shadow-2xl overflow-hidden animate-modal-content dark:text-white text-gray-900 p-6">
    <div className="flex items-center justify-between mb-8">
     <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl dark:bg-white/10 bg-black/10 flex items-center justify-center">
       <SettingsIcon className="w-5 h-5 dark:text-gray-400 text-gray-600" />
      </div>
      <h2 className="text-xl font-semibold">{t("settings")}</h2>
     </div>
     <button 
      onClick={onClose}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:dark:bg-white/10 hover:bg-black/10 transition-colors"
     >
      <X className="w-5 h-5 dark:text-gray-500 text-gray-400" />
     </button>
    </div>

    <div className="space-y-6">
     {/* Theme Setting */}
     <div className="space-y-3">
      <label className="text-sm font-medium dark:text-gray-500 text-gray-400 uppercase tracking-wider">{t("appearance")}</label>
      <div className="grid grid-cols-2 gap-3">
       <button
        onClick={() => handleThemeChange('light')}
        className={`flex items-center justify-center gap-2 p-3 rounded-xl border dark:border-white/10 border-black/10 transition-all ${theme === 'light' ? 'dark:bg-white/10 bg-black/10 dark:border-white/20 border-black/20 dark:text-white text-gray-900' : ' dark:text-gray-400 text-gray-600 hover:dark:bg-white/5 hover:bg-black/5'}`}
       >
        <Sun className="w-4 h-4" />
        <span>{t("light")}</span>
       </button>
       <button
        onClick={() => handleThemeChange('dark')}
        className={`flex items-center justify-center gap-2 p-3 rounded-xl border dark:border-white/10 border-black/10 transition-all ${theme === 'dark' ? 'dark:bg-white/10 bg-black/10 dark:border-white/20 border-black/20 dark:text-white text-gray-900' : ' dark:text-gray-400 text-gray-600 hover:dark:bg-white/5 hover:bg-black/5'}`}
       >
        <Moon className="w-4 h-4" />
        <span>{t("dark")}</span>
       </button>
      </div>
     </div>

     {/* Language Setting */}
     <div className="space-y-3">
      <label className="text-sm font-medium dark:text-gray-500 text-gray-400 uppercase tracking-wider">{t("language")}</label>
      <div className="grid grid-cols-2 gap-3">
       <button
        onClick={() => setLanguage('en')}
        className={`flex items-center justify-center gap-2 p-3 rounded-xl border dark:border-white/10 border-black/10 transition-all ${language === 'en' ? 'dark:bg-white/10 bg-black/10 dark:border-white/20 border-black/20 dark:text-white text-gray-900' : ' dark:text-gray-400 text-gray-600 hover:dark:bg-white/5 hover:bg-black/5'}`}
       >
        <Globe className="w-4 h-4" />
        <span>{t("english")}</span>
       </button>
       <button
        onClick={() => setLanguage('vi')}
        className={`flex items-center justify-center gap-2 p-3 rounded-xl border dark:border-white/10 border-black/10 transition-all ${language === 'vi' ? 'dark:bg-white/10 bg-black/10 dark:border-white/20 border-black/20 dark:text-white text-gray-900' : ' dark:text-gray-400 text-gray-600 hover:dark:bg-white/5 hover:bg-black/5'}`}
       >
        <Globe className="w-4 h-4" />
        <span>{t("vietnamese")}</span>
       </button>
      </div>
     </div>
    </div>
   </div>
  </div>,
  document.body
 );
}
