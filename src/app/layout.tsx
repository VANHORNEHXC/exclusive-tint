import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LocaleProvider } from "@/context/LocaleContext";
import { LanguageSwitcher } from "@/components/language-switcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exclusive Tint | Polarizado y protección vehicular",
  description:
    "Polarizado cerámico, protección de pintura PPF y recubrimiento cerámico para tu vehículo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased scroll-smooth">
      <body className="min-h-screen overflow-x-hidden bg-black text-white antialiased">
        <LocaleProvider>
          <LanguageSwitcher />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
