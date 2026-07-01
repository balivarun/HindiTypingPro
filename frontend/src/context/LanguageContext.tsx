import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Lang, TranslationKey } from '../translations';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem('htp_lang') as Lang) ?? 'en'
  );

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('htp_lang', next);
  };

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.en[key];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
