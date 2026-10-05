import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { getLanguage, setLanguage as persistLanguage } from '../utils/storage';
import { LanguageCode, translate, TranslationKey } from '../utils/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key, values) => translate('en', key, values),
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const load = async () => {
      setLanguageState(await getLanguage());
    };
    load();
  }, []);

  const setLanguage = async (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    await persistLanguage(nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey, values?: Record<string, string | number>) =>
        translate(language, key, values),
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
