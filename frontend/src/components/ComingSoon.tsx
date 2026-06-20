export function ComingSoon({ title, note }: { title: string; note?: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
        <div className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-surface text-brand">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-4 font-display font-semibold text-ink">Скоро в новом интерфейсе</p>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm mx-auto">
          {note ?? "Раздел в разработке. Всё будет внутри нового дизайна, без переходов в Moodle."}
        </p>
      </div>
    </div>
  );
}
