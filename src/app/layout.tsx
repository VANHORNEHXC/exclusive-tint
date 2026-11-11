'use client';
import { LocaleProvider, useLocale } from '@/context/LocaleContext';
import React from 'react';

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { locale, toggleLocale } = useLocale();

  return (
    <html lang={locale} className="h-full antialiased scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Exclusive Tint – Polarizado Cerámico de Élite</title>
        <meta
          name="description"
          content="Polarizado cerámico nano‑tecnológico, PPF y recubrimiento cerámico 9H para vehículos de alta gama. Instalación certificada con garantía de por vida."
        />
      </head>
      <body className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
        {/* Fixed language toggle – top‑right corner, above everything */}
        <button
          onClick={toggleLocale}
          aria-label="Switch language"
          className="
            fixed top-4 right-4 z-[9999]
            rounded-full px-4 py-1.5 text-xs font-bold tracking-widest
            bg-amber-500 text-black
            hover:bg-amber-400 active:scale-95
            transition-all shadow-lg shadow-amber-500/30
          "
        >
          {locale === 'es' ? 'EN' : 'ES'}
        </button>

        {children}
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <InnerLayout>{children}</InnerLayout>
    </LocaleProvider>
  );
}
