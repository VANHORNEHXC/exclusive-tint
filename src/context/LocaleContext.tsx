"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { defaultSiteTexts } from "@/lib/site-content";
import type { SiteImage } from "@/lib/site-content";
import type { Locale } from "@/lib/translations";

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string) => string;
  image: (slot: string) => SiteImage | undefined;
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
  const [content, setContent] = useState<{ texts: Record<Locale, Record<string, string>>; images: Record<string, SiteImage> }>({ texts: { es: {}, en: {} }, images: {} });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/site/content", { signal: controller.signal, cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Content unavailable")))
      .then((value) => { if (!controller.signal.aborted) setContent(value); })
      .catch(() => { /* Published defaults remain available if content service is offline. */ });
    return () => controller.abort();
  }, []);

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
    return content.texts[locale]?.[key] ?? defaultSiteTexts[locale][key] ?? key;
  }

  function image(slot: string) { return content.images[slot]; }

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t, image }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
