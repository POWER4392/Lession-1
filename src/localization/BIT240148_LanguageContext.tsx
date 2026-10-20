import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from './BIT240148_Strings';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {}
});

const LANG_STORAGE_KEY = 'BIT240148_SelectedLanguage';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mặc định: English (theo yêu cầu đề thi 4.5)
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANG_STORAGE_KEY).then(saved => {
      if (saved === 'vi' || saved === 'en') {
        setLanguageState(saved);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    const next: Language = language === 'en' ? 'vi' : 'en';
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
