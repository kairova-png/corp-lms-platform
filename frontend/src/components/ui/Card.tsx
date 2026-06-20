import type { HTMLAttributes, ReactNode } from "react";

/** Базовая карточка-поверхность. */
export function Card({ children, className = "", ...props }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
