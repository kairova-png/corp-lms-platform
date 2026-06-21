"use client";

// UI-оболочка прохождения теста (фокус-режим, открывается в новой вкладке).
// Сейчас на демо-вопросах всех типов; подключение к Moodle WS (mod_quiz_*: start_attempt →
// get_attempt_data → process_attempt) — следующая фаза. Дизайн/UX финальные.

import { useMemo, useState } from "react";
import { Button, Card, ProgressBar, Badge } from "@/components/ui";

type Question =
  | { id: number; type: "single"; text: string; options: string[]; correct: number }
  | { id: number; type: "multiple"; text: string; options: string[]; correct: number[] }
  | { id: number; type: "truefalse"; text: string; correct: boolean }
  | { id: number; type: "numeric"; text: string; correct: number };

const DEMO: Question[] = [
  { id: 1, type: "single", text: "Какой документ регулирует охрану труда?", options: ["Трудовой кодекс", "Гражданский кодекс", "Налоговый кодекс"], correct: 0 },
  { id: 2, type: "multiple", text: "Что относится к СИЗ?", options: ["Каска", "Перчатки", "Письменный стол", "Кресло"], correct: [0, 1] },
  { id: 3, type: "truefalse", text: "Применение СИЗ на опасном производстве обязательно.", correct: true },
  { id: 4, type: "numeric", text: "Сколько основных шагов в алгоритме действий при ЧС?", correct: 4 },
];

export function QuizRunner({ quizName, passmark = 70 }: { quizName: string; passmark?: number }) {
  const [stage, setStage] = useState<"start" | "quiz" | "result">("start");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});

  const q = DEMO[idx];
  const total = DEMO.length;

  const score = useMemo(() => {
    let ok = 0;
    for (const item of DEMO) {
      const a = answers[item.id];
      if (item.type === "single" && a === item.correct) ok++;
      else if (item.type === "truefalse" && a === item.correct) ok++;
      else if (item.type === "numeric" && Number(a) === item.correct) ok++;
      else if (item.type === "multiple" && Array.isArray(a)) {
        const set = new Set(a as number[]);
        if (set.size === item.correct.length && item.correct.every((c) => set.has(c))) ok++;
      }
    }
    return Math.round((ok / total) * 100);
  }, [answers, total]);

  const setAnswer = (id: number, val: unknown) => setAnswers((p) => ({ ...p, [id]: val }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Шапка */}
      <header className="bg-ink text-white">
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <span className="font-display font-semibold truncate">{quizName}</span>
          <button onClick={() => window.close()} className="text-white/70 hover:text-white text-sm cursor-pointer">
            Закрыть ✕
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {stage === "start" && (
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-display font-bold text-ink">{quizName}</h1>
            <p className="mt-2 text-zinc-500">Проверьте знания по курсу.</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div><div className="text-2xl font-display font-bold text-ink">{total}</div><div className="text-zinc-500">вопросов</div></div>
              <div><div className="text-2xl font-display font-bold text-ink">{passmark}%</div><div className="text-zinc-500">проходной</div></div>
              <div><div className="text-2xl font-display font-bold text-ink">∞</div><div className="text-zinc-500">попыток</div></div>
            </div>
            <Button size="lg" className="mt-8 w-full" onClick={() => setStage("quiz")}>Начать тест</Button>
          </Card>
        )}

        {stage === "quiz" && q && (
          <div>
            <div className="flex justify-between text-sm text-zinc-500 mb-2">
              <span>Вопрос {idx + 1} из {total}</span>
              <span>{TYPE_LABEL[q.type]}</span>
            </div>
            <ProgressBar value={((idx + 1) / total) * 100} className="mb-6" />

            <Card className="p-6">
              <h2 className="text-lg font-display font-semibold text-ink">{q.text}</h2>
              <div className="mt-5 space-y-2.5">
                {q.type === "single" &&
                  q.options.map((opt, i) => (
                    <Option key={i} selected={answers[q.id] === i} onClick={() => setAnswer(q.id, i)}>{opt}</Option>
                  ))}
                {q.type === "multiple" &&
                  q.options.map((opt, i) => {
                    const arr = (answers[q.id] as number[]) || [];
                    const sel = arr.includes(i);
                    return (
                      <Option key={i} selected={sel} onClick={() => setAnswer(q.id, sel ? arr.filter((x) => x !== i) : [...arr, i])}>{opt}</Option>
                    );
                  })}
                {q.type === "truefalse" &&
                  ["Да", "Нет"].map((opt, i) => (
                    <Option key={i} selected={answers[q.id] === (i === 0)} onClick={() => setAnswer(q.id, i === 0)}>{opt}</Option>
                  ))}
                {q.type === "numeric" && (
                  <input
                    type="number"
                    value={(answers[q.id] as number) ?? ""}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className="w-40 h-11 rounded-lg border border-zinc-300 px-3.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    placeholder="Ответ"
                  />
                )}
              </div>
            </Card>

            <div className="mt-6 flex justify-between">
              <Button variant="ghost" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Назад</Button>
              {idx < total - 1 ? (
                <Button onClick={() => setIdx((i) => i + 1)}>Далее</Button>
              ) : (
                <Button onClick={() => setStage("result")}>Завершить</Button>
              )}
            </div>
          </div>
        )}

        {stage === "result" && (
          <Card className="p-8 text-center">
            <div className="mx-auto grid place-items-center w-20 h-20 rounded-full" style={{ background: score >= passmark ? "#dcfce7" : "#fee2e2" }}>
              <span className="text-2xl font-display font-bold" style={{ color: score >= passmark ? "#16a34a" : "#dc2626" }}>{score}%</span>
            </div>
            <h1 className="mt-4 text-xl font-display font-bold text-ink">
              {score >= passmark ? "Тест пройден" : "Тест не пройден"}
            </h1>
            <div className="mt-2"><Badge tone={score >= passmark ? "success" : "warning"}>Проходной балл {passmark}%</Badge></div>

            <div className="mt-6 text-left space-y-2">
              {DEMO.map((item, i) => {
                const a = answers[item.id];
                let ok = false;
                if (item.type === "single") ok = a === item.correct;
                else if (item.type === "truefalse") ok = a === item.correct;
                else if (item.type === "numeric") ok = Number(a) === item.correct;
                else if (item.type === "multiple" && Array.isArray(a)) {
                  const s = new Set(a as number[]);
                  ok = s.size === item.correct.length && item.correct.every((c) => s.has(c));
                }
                return (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <span className={ok ? "text-success" : "text-red-500"}>{ok ? "✓" : "✕"}</span>
                    <span className="text-zinc-600">Вопрос {i + 1}: {item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => { setAnswers({}); setIdx(0); setStage("start"); }}>Пройти заново</Button>
              <Button className="flex-1" onClick={() => window.close()}>Закрыть</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

const TYPE_LABEL: Record<string, string> = {
  single: "Один вариант",
  multiple: "Несколько вариантов",
  truefalse: "Да / Нет",
  numeric: "Число",
};

function Option({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition cursor-pointer ${
        selected ? "border-brand bg-surface text-brand font-semibold" : "border-zinc-200 hover:border-brand/40 text-ink"
      }`}
    >
      {children}
    </button>
  );
}
