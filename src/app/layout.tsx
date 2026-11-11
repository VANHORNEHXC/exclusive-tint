import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exclusive Tint | Polarizado Nano-Cerámico & Protección Automotriz",
  description:
    "Estudio especializado en polarizado nano-cerámico de alto rechazo térmico, Paint Protection Film (PPF) y Ceramic Coating. Corte computarizado milimétrico.",
  keywords: [
    "Exclusive Tint",
    "polarizado cerámico",
    "window tint",
    "PPF",
    "paint protection film",
    "rechazo de calor",
    "nano ceramica",
    "corte computarizado",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">{children}</body>
    </html>
  );
}
