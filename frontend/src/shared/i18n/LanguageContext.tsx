import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface LanguageContextType {
 language: Language;
 setLanguage: (lang: Language) => void;
 t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
 const [language, setLanguageState] = useState<Language>('en');

 useEffect(() => {
  const savedLang = localStorage.getItem('language') as Language | null;
  if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
   setLanguageState(savedLang);
  }
 }, []);

 const setLanguage = (lang: Language) => {
  setLanguageState(lang);
  localStorage.setItem('language', lang);
 };

 const t = (key: TranslationKey): string => {
  return translations[language][key] || key;
 };

 return (
  <LanguageContext.Provider value={{ language, setLanguage, t }}>
   {children}
  </LanguageContext.Provider>
 );
}

export function useLanguage() {
 const context = useContext(LanguageContext);
 if (context === undefined) {
  throw new Error('useLanguage must be used within a LanguageProvider');
 }
 return context;
}
