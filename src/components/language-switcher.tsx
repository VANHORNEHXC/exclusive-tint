"use client";

import { useLocale } from "@/context/LocaleContext";

export function LanguageSwitcher() {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
      className="fixed right-4 top-4 z-[9999] rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold tracking-widest text-black shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-400 active:scale-95"
    >
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
