'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import bgStrings from '@/locales/bg.json';
import enStrings from '@/locales/en.json';

type Lang = 'bg' | 'en';
type Strings = typeof bgStrings;

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bg');

  useEffect(() => {
    const stored = localStorage.getItem('bk-lang') as Lang | null;
    if (stored === 'bg' || stored === 'en') setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('bk-lang', l);
  }, []);

  const t = lang === 'en' ? (enStrings as unknown as Strings) : bgStrings;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
