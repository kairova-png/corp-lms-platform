import type { ReactNode } from "react";

type Tone = "brand" | "success" | "neutral" | "warning";

const TONES: Record<Tone, string> = {
  brand: "bg-surface text-brand",
  success: "bg-green-50 text-green-700",
  neutral: "bg-zinc-100 text-zinc-600",
  warning: "bg-amber-50 text-amber-700",
};

/** Бейдж/чип статуса. */
export function Badge({ tone = "brand", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
