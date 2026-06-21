"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";

type Init = { assignid: number | null; state: string; text: string; grade: string | null; feedback: string };

const STATE_LABEL: Record<string, string> = {
  new: "Не сдано",
  draft: "Черновик",
  submitted: "Отправлено",
};

function stripHtml(s: string): string {
  return (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function AssignmentView({
  name,
  desc,
  courseId,
  cmid,
  initial,
}: {
  name: string;
  desc: string;
  courseId: number;
  cmid: number;
  initial: Init;
}) {
  const [text, setText] = useState(stripHtml(initial.text));
  const [state, setState] = useState(initial.state);
  const [grade, setGrade] = useState<string | null>(initial.grade);
  const [feedback, setFeedback] = useState(stripHtml(initial.feedback));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submitted = state === "submitted";
  const graded = grade !== null && grade !== undefined;

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/assignment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignid: initial.assignid, courseid: courseId, cmid, text }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setState(d.state);
      setGrade(d.grade ?? null);
      setFeedback(stripHtml(d.feedback || ""));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-ink text-white">
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <span className="font-display font-semibold truncate">{name}</span>
          <button onClick={() => window.close()} className="text-white/70 hover:text-white text-sm cursor-pointer">Закрыть ✕</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-display font-bold text-ink">{name}</h1>
        {desc && <p className="mt-2 text-zinc-600">{desc}</p>}
        <div className="mt-3">
          <Badge tone={graded ? "success" : submitted ? "brand" : "neutral"}>
            {graded ? "Оценено" : STATE_LABEL[state] ?? "Не сдано"}
          </Badge>
        </div>

        {graded && (
          <Card className="mt-6 p-6">
            <h2 className="font-display font-semibold text-ink">Результат</h2>
            <p className="mt-2 text-2xl font-display font-bold text-brand">{grade}</p>
            {feedback && <p className="mt-2 text-sm text-zinc-600">{feedback}</p>}
          </Card>
        )}

        <Card className="mt-6 p-6">
          <h2 className="font-display font-semibold text-ink">Ваш ответ</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Введите ответ…"
            className="mt-3 w-full rounded-lg border border-zinc-300 p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          {err && <p className="mt-2 text-sm text-red-600 break-all">{err}</p>}
          <Button type="button" className="mt-4 w-full" onClick={submit} disabled={busy || !text.trim()}>
            {busy ? "Отправляем…" : submitted ? "Переотправить" : "Отправить на проверку"}
          </Button>
        </Card>

        <p className="mt-3 text-xs text-zinc-400">Сдаётся в Moodle (mod_assign, online-текст). Загрузка файлов — следующим шагом.</p>
      </main>
    </div>
  );
}
