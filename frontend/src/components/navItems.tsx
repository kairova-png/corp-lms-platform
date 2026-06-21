import type { ReactNode } from "react";

export const NAV = [
  { href: "/", label: "Главная", icon: "home" },
  { href: "/my", label: "Моё обучение", icon: "book" },
  { href: "/catalog", label: "Каталог", icon: "grid" },
  { href: "/calendar", label: "Календарь", icon: "calendar" },
  { href: "/grades", label: "Оценки", icon: "chart" },
  { href: "/certificates", label: "Сертификаты", icon: "award" },
  { href: "/profile", label: "Профиль", icon: "user" },
];

const PATHS: Record<string, ReactNode> = {
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  book: <path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2zM18 3v16" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  award: <path d="M12 14a5 5 0 100-10 5 5 0 000 10zM9 13l-1 8 4-2 4 2-1-8" />,
  user: <path d="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z" />,
};

export function NavIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}
