"use client";

import { useState } from "react";

export type Item = {
  cmid: number;
  name: string;
  type: string; // page | quiz | assign | customcert | url | resource ...
  video?: string | null;
  desc?: string;
  html?: string; // HTML текстового урока (рендерим во фронте)
};
export type Section = { title: string; items: Item[] };

const TYPE_LABEL: Record<string, string> = {
  page: "Видео",
  quiz: "Тест",
  assign: "Задание",
  customcert: "Сертификат",
  url: "Ссылка",
  resource: "Файл",
};

function TypeIcon({ type, active }: { type: string; active: boolean }) {
  const cls = `w-4 h-4 ${active ? "text-brand-fg" : "text-brand"}`;
  if (type === "page")
    return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
  if (type === "quiz")
    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3 8-8M21 12a9 9 0 11-6-8.5" strokeLinecap="round" /></svg>);
  if (type === "customcert")
    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="9" r="5" /><path d="M9 13l-1 8 4-2 4 2-1-8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" /></svg>);
}

export function CourseView({
  curriculum,
  doneCmids,
}: {
  curriculum: Section[];
  doneCmids: number[];
}) {
  const items = curriculum.flatMap((s) => s.items);
  const firstVideo = items.find((i) => i.video);
  const [active, setActive] = useState<Item | null>(firstVideo ?? items[0] ?? null);

  const done = new Set(doneCmids);
  const total = items.length;
  const completed = items.filter((i) => done.has(i.cmid)).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Плеер + описание */}
      <div>
        {active?.video ? (
          <>
            <video
              key={active.video}
              controls
              playsInline
              preload="none"
              className="w-full rounded-2xl bg-black aspect-video"
              src={active.video}
            />
            <div className="mt-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                {TYPE_LABEL[active.type] ?? active.type}
              </span>
              <h2 className="mt-1 text-xl font-bold text-ink">{active.name}</h2>
              {active.desc && <p className="mt-2 text-zinc-600 leading-relaxed">{active.desc}</p>}
            </div>
          </>
        ) : active?.html ? (
          <article className="rounded-2xl border border-zinc-200 bg-white p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {TYPE_LABEL[active.type] ?? "Урок"}
            </span>
            <h2 className="mt-1 text-xl font-bold text-ink">{active.name}</h2>
            <div
              className="mt-3 text-zinc-700 leading-relaxed [&_p]:mt-2 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:font-semibold [&_h4]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand [&_a]:underline [&_img]:rounded-lg [&_img]:my-3"
              dangerouslySetInnerHTML={{ __html: active.html }}
            />
          </article>
        ) : active ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <div className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-surface text-brand">
              <TypeIcon type={active.type} active={false} />
            </div>
            <p className="mt-4 font-display font-semibold text-ink">{active.name}</p>
            <p className="mt-1 text-sm text-zinc-500 max-w-sm mx-auto">
              {TYPE_LABEL[active.type] ?? "Этот элемент"} — скоро прямо здесь, без перехода в Moodle.
            </p>
          </div>
        ) : (
          <div className="aspect-video rounded-2xl bg-ink grid place-items-center text-white/70 text-sm">
            Выберите урок в программе курса
          </div>
        )}
      </div>

      {/* Программа курса */}
      <aside className="lg:sticky lg:top-20 self-start">
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <div className="p-4 border-b border-zinc-100">
            <div className="flex justify-between text-sm">
              <span className="font-display font-semibold text-ink">Программа курса</span>
              <span className="text-zinc-500">{completed}/{total}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {curriculum.map((sec, si) => (
              <div key={si} className="border-b border-zinc-100 last:border-0">
                <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  {sec.title}
                </div>
                <ul>
                  {sec.items.map((it) => {
                    const isActive = active?.cmid === it.cmid;
                    const isDone = done.has(it.cmid);
                    const common = "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition";
                    const inner = (
                      <>
                        <span
                          className={`grid place-items-center w-7 h-7 rounded-lg flex-none ${
                            isActive ? "bg-brand" : "bg-surface"
                          }`}
                        >
                          <TypeIcon type={it.type} active={isActive} />
                        </span>
                        <span className={`flex-1 line-clamp-1 ${isActive ? "text-brand font-semibold" : "text-ink"}`}>
                          {it.name}
                        </span>
                        {isDone && (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-success flex-none" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </>
                    );
                    return (
                      <li key={it.cmid}>
                        {it.video ? (
                          <button onClick={() => setActive(it)} className={`${common} ${isActive ? "bg-surface" : "hover:bg-zinc-50"} cursor-pointer`}>
                            {inner}
                          </button>
                        ) : (
                          <button onClick={() => setActive(it)} className={`${common} ${isActive ? "bg-surface" : "hover:bg-zinc-50"} cursor-pointer`}>
                            {inner}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
