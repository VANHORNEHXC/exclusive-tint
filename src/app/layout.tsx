'use client';
import { LocaleProvider, useLocale } from '@/context/LocaleContext';
import React from 'react';

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { locale, toggleLocale } = useLocale();
  return (
    <html
      lang={locale}
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <button
          onClick={toggleLocale}
          className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded"
        >
          EN/ES
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
