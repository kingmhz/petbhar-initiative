'use client';

import React, { createContext, useContext, useSyncExternalStore, useCallback } from 'react';
import { Locale, translations, TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'petbhar_locale') callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): Locale {
  try {
    const saved = localStorage.getItem('petbhar_locale');
    if (saved === 'hi') return 'hi';
  } catch {
    // ignore
  }
  return 'en';
}

function getServerSnapshot(): Locale {
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((newLocale: Locale) => {
    try {
      localStorage.setItem('petbhar_locale', newLocale);
      document.documentElement.lang = newLocale;
      listeners.forEach((listener) => listener());
    } catch {
      // ignore
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'hi' : 'en');
  }, [locale, setLocale]);

  const t = useCallback((key: TranslationKey): string => {
    const dict = translations[locale] || translations.en;
    return dict[key] || translations.en[key] || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      toggleLocale: () => {},
      t: (key: TranslationKey) => translations.en[key] || key
    };
  }
  return context;
}
