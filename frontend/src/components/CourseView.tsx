"use client";

import { useState } from "react";
import { Tabs, Badge, EmptyState } from "@/components/ui";

export type Item = {
  cmid: number;
  name: string;
  type: string; // page | quiz | assign | customcert | url | resource | folder ...
  url?: string;
  video?: string | null;
  desc?: string;
  html?: string;
};
export type Section = { title: string; items: Item[] };

const TYPE_LABEL: Record<string, string> = {
  page: "Видео",
  quiz: "Тест",
  assign: "Задание",
  customcert: "Сертификат",
  url: "Ссылка",
  resource: "Файл",
  folder: "Папка",
};

function TypeIcon({ type, active }: { type: string; active: boolean }) {
  const cls = `w-4 h-4 ${active ? "text-brand-fg" : "text-brand"}`;
  if (type === "page")
    return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
  if (type === "quiz")
    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3 8-8M21 12a9 9 0 11-6-8.5" strokeLinecap="round" /></svg>);
  if (type === "assign")
    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5h6M9 9h6M9 13h4M5 3h14v18l-7-3-7 3z" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  if (type === "customcert")
    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="9" r="5" /><path d="M9 13l-1 8 4-2 4 2-1-8" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" /></svg>);
}

export function CourseView({
  courseId,
  summary,
  curriculum,
  doneCmids,
}: {
  courseId: number;
  summary: string;
  curriculum: Section[];
  doneCmids: number[];
}) {
  const items = curriculum.flatMap((s) => s.items);
  const firstVideo = items.find((i) => i.video);
  const [active, setActive] = useState<Item | null>(firstVideo ?? items.find((i) => i.html) ?? null);

  const done = new Set(doneCmids);
  const total = items.length;
  const completed = items.filter((i) => done.has(i.cmid)).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const quizzes = items.filter((i) => i.type === "quiz");
  const materials = items.filter((i) => ["resource", "url", "folder"].includes(i.type));

  const quizHref = (cmid: number) => `/test/${courseId}/${cmid}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Левая колонка: плеер + вкладки */}
      <div className="min-w-0">
        {active?.video ? (
          <video
            key={active.video}
            controls
            playsInline
            preload="none"
            className="w-full rounded-2xl bg-black aspect-video"
            src={active.video}
          />
        ) : active?.html ? (
          <article className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-xl font-display font-bold text-ink">{active.name}</h2>
            <div
              className="mt-3 text-zinc-700 leading-relaxed [&_p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-brand [&_a]:underline [&_img]:rounded-lg"
              dangerouslySetInnerHTML={{ __html: active.html }}
            />
          </article>
        ) : (
          <div className="aspect-video rounded-2xl bg-ink grid place-items-center text-white/70 text-sm">
            Выберите урок в программе курса
          </div>
        )}

        {active && (
          <h1 className="mt-4 text-xl font-display font-bold text-ink">{active.name}</h1>
        )}

        <div className="mt-4">
          <Tabs
            tabs={[
              {
                label: "Описание",
                content: (
                  <p className="text-zinc-700 leading-relaxed">
                    {active?.desc || summary || "Описание появится позже."}
                  </p>
                ),
              },
              {
                label: "Материалы",
                content: materials.length ? (
                  <ul className="divide-y divide-zinc-100">
                    {materials.map((m) => (
                      <li key={m.cmid} className="py-3 flex items-center justify-between">
                        <span className="text-ink">{m.name}</span>
                        <Badge tone="neutral">{TYPE_LABEL[m.type] ?? m.type}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500">Материалов для скачивания нет.</p>
                ),
              },
              {
                label: "Тесты",
                content: quizzes.length ? (
                  <ul className="space-y-3">
                    {quizzes.map((q) => (
                      <li key={q.cmid} className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
                        <div className="flex items-center gap-3">
                          <span className="grid place-items-center w-9 h-9 rounded-lg bg-surface">
                            <TypeIcon type="quiz" active={false} />
                          </span>
                          <span className="font-medium text-ink">{q.name}</span>
                        </div>
                        <a
                          href={quizHref(q.cmid)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg hover:bg-brand-dark transition"
                        >
                          Пройти тест
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500">В этом курсе пока нет тестов.</p>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Правая колонка: программа курса */}
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

          <div className="max-h-[65vh] overflow-y-auto">
            {curriculum.map((sec, si) => (
              <div key={si} className="border-b border-zinc-100 last:border-0">
                <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  {sec.title}
                </div>
                <ul>
                  {sec.items.map((it) => {
                    const isActive = active?.cmid === it.cmid;
                    const isDone = done.has(it.cmid);
                    const newTab = it.type === "quiz" || it.type === "assign";
                    const inner = (
                      <>
                        <span className={`grid place-items-center w-7 h-7 rounded-lg flex-none ${isActive ? "bg-brand" : "bg-surface"}`}>
                          <TypeIcon type={it.type} active={isActive} />
                        </span>
                        <span className={`flex-1 line-clamp-1 ${isActive ? "text-brand font-semibold" : "text-ink"}`}>{it.name}</span>
                        {newTab && (
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-400 flex-none" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 4h6v6M20 4l-9 9M5 7v12h12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                        {isDone && !newTab && (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-success flex-none" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </>
                    );
                    const cls = "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition";
                    return (
                      <li key={it.cmid}>
                        {it.type === "quiz" ? (
                          <a href={quizHref(it.cmid)} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-zinc-50`}>{inner}</a>
                        ) : (
                          <button onClick={() => setActive(it)} className={`${cls} ${isActive ? "bg-surface" : "hover:bg-zinc-50"} cursor-pointer`}>{inner}</button>
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
