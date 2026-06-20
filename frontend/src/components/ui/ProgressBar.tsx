/** Линейный прогресс-бар (success-зелёный). */
export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 rounded-full bg-zinc-100 overflow-hidden ${className}`}>
      <div className="h-full rounded-full bg-success transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}
