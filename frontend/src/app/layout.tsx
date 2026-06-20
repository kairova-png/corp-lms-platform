import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

// Шрифты бренда KMG PetroChem (Montserrat + Inter), оба с кириллицей (KZ/RU/EN).
const display = Montserrat({
  variable: "--font-display-src",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = Inter({
  variable: "--font-body-src",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Corp LMS — Моё обучение",
  description: "Современный интерфейс корпоративного обучения поверх Moodle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
