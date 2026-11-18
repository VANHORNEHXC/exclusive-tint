"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

type Theme = "dark" | "light";
const THEME_KEY = "exclusive-tint-theme";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== THEME_KEY) return;
    const next = event.newValue === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    onChange();
  }
  window.addEventListener("storage", onStorage);
  document.addEventListener("exclusive-tint-themechange", onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    document.removeEventListener("exclusive-tint-themechange", onChange);
  };
}

export function ThemeToggle() {
  const { locale } = useLocale();
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "dark");

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* The visual switch still works when storage is unavailable. */ }
    document.dispatchEvent(new Event("exclusive-tint-themechange"));
  }

  const label = theme === "dark"
    ? (locale === "es" ? "Activar modo claro" : "Switch to light mode")
    : (locale === "es" ? "Activar modo oscuro" : "Switch to dark mode");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={theme === "light"}
      title={label}
      className="theme-toggle inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-zinc-900 text-amber-400 transition-colors hover:border-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      {theme === "dark" ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
    </button>
  );
}
