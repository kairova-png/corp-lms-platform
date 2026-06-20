import type { ReactNode } from "react";
import { Card } from "./Card";

/** Плитка KPI для дашборда. */
export function StatTile({ value, label, icon }: { value: ReactNode; label: string; icon?: ReactNode }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      {icon && <span className="grid place-items-center w-11 h-11 rounded-xl bg-surface text-brand flex-none">{icon}</span>}
      <div className="min-w-0">
        <div className="text-2xl font-display font-bold text-ink leading-tight">{value}</div>
        <div className="text-sm text-zinc-500 truncate">{label}</div>
      </div>
    </Card>
  );
}
