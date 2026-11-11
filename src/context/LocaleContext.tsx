"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { translations } from "@/lib/translations";
import type { Locale } from "@/lib/translations";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);
const LOCALE_EVENT = "exclusive-tint-locale-change";
let memoryLocale: Locale = "es";

function getLocale(): Locale {
  try {
    const saved = window.localStorage.getItem("locale");
    return saved === "en" || saved === "es" ? saved : memoryLocale;
  } catch {
    return memoryLocale;
  }
}

function subscribeToLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCALE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCALE_EVENT, callback);
  };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribeToLocale, getLocale, () => "es");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function toggleLocale() {
    memoryLocale = locale === "es" ? "en" : "es";
    try {
      window.localStorage.setItem("locale", memoryLocale);
    } catch {
      // Keep the choice in memory when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }

  function t(key: string) {
    return translations[locale][key] ?? key;
  }

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
