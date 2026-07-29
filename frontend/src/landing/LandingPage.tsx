import { ArrowRight, Sparkles, Mic, FileText, Search } from "lucide-react";
import { useLanguage } from "../shared/i18n/LanguageContext";

export function LandingPage() {
 const { t } = useLanguage();

 const handleStart = () => {
  // Navigate to /upload - this will simulate creating a workspace
  const nextPath = "/upload";
  window.history.pushState({}, "", nextPath);
  // Dispatch a popstate event to trigger the router in App.tsx
  window.dispatchEvent(new PopStateEvent("popstate"));
 };

 return (
  <div className="h-screen dark:bg-[#0A0A0A] bg-gray-50 dark:text-white text-gray-900 overflow-y-auto overflow-x-hidden relative font-sans selection:bg-purple-500/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
   {/* Background Gradients & Glows */}
   <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
   <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '5s' }} />
   <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
   
   {/* Navbar (Minimal) */}
   <nav className="w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10">
    <div className="flex h-[32px] items-center gap-3">
     <img
      src="/flow-logo.svg"
      alt="FLOW"
      className="h-[32px] w-auto object-contain transition-transform hover:scale-105"
     />
    </div>
   </nav>

   {/* Hero Section */}
   <main className="max-w-7xl mx-auto px-8 pt-24 pb-32 flex flex-col items-center justify-center text-center relative z-10 min-h-[80vh]">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 text-sm dark:text-gray-400 text-gray-600 mb-8 backdrop-blur-md animate-fade-slide-in">
     <Sparkles className="w-4 h-4 text-purple-400" />
     <span>{t("landing_anon_badge")}</span>
    </div>

    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-fade-slide-in" style={{ animationDelay: '100ms' }}>
     {t("landing_title")} <br className="hidden md:block" />
     <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
      {t("landing_title_span")}
     </span>
    </h1>

    <div className="text-[14px] md:text-[16px] font-semibold text-purple-500 dark:text-purple-400/90 max-w-3xl mb-8 animate-fade-slide-in tracking-wide uppercase border border-purple-500/20 bg-purple-500/10 px-6 py-3 rounded-2xl backdrop-blur-md" style={{ animationDelay: '150ms' }}>
     {t("landing_model_subtitle")}
    </div>

    <p className="text-lg md:text-xl dark:text-gray-400 text-gray-600 max-w-2xl mb-12 animate-fade-slide-in" style={{ animationDelay: '200ms' }}>
     {t("landing_subtitle")}
    </p>

    <button 
     onClick={handleStart}
     className="group relative inline-flex items-center gap-3 px-8 py-4 dark:bg-white bg-gray-900 dark:text-gray-900 text-white font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(0,0,0,0.4)] animate-fade-slide-in"
     style={{ animationDelay: '300ms' }}
    >
     <span>{t("landing_start")}</span>
     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>

    {/* Feature Highlights */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full animate-fade-slide-in" style={{ animationDelay: '400ms' }}>
     <div className="flex flex-col items-center text-center p-6 rounded-3xl dark:bg-white/5 bg-white border dark:border-white/5 border-gray-200 shadow-md backdrop-blur-sm">
      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
       <Mic className="w-6 h-6 text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{t("feature_transcribe_title")}</h3>
      <p className="text-sm dark:text-gray-400 text-gray-600">{t("feature_transcribe_desc")}</p>
     </div>
     <div className="flex flex-col items-center text-center p-6 rounded-3xl dark:bg-white/5 bg-white border dark:border-white/5 border-gray-200 shadow-md backdrop-blur-sm">
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
       <Search className="w-6 h-6 text-cyan-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{t("feature_search_title")}</h3>
      <p className="text-sm dark:text-gray-400 text-gray-600">{t("feature_search_desc")}</p>
     </div>
     <div className="flex flex-col items-center text-center p-6 rounded-3xl dark:bg-white/5 bg-white border dark:border-white/5 border-gray-200 shadow-md backdrop-blur-sm">
      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
       <FileText className="w-6 h-6 text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{t("feature_private_title")}</h3>
      <p className="text-sm dark:text-gray-400 text-gray-600">{t("feature_private_desc")}</p>
     </div>
    </div>
   </main>
  </div>
 );
}
