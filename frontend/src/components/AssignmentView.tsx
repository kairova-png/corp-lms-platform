"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";

export function AssignmentView({ name, desc }: { name: string; desc: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [text, setText] = useState("");

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
        <div className="mt-3"><Badge tone={submitted ? "success" : "neutral"}>{submitted ? "Отправлено" : "Не сдано"}</Badge></div>

        <Card className="mt-6 p-6">
          <h2 className="font-display font-semibold text-ink">Ваш ответ</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Введите ответ…"
            className="mt-3 w-full rounded-lg border border-zinc-300 p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <div className="mt-4">
            <span className="text-sm font-medium text-ink">Файл</span>
            <div className="mt-1.5 rounded-xl border-2 border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
              Перетащите файл сюда или <span className="text-brand font-semibold">выберите</span>
            </div>
          </div>
          <Button type="button" className="mt-5 w-full" onClick={() => setSubmitted(true)} disabled={submitted}>
            {submitted ? "Отправлено" : "Отправить на проверку"}
          </Button>
        </Card>

        {submitted && (
          <Card className="mt-4 p-6">
            <h2 className="font-display font-semibold text-ink">Статус проверки</h2>
            <p className="mt-2 text-sm text-zinc-500">Ответ отправлен. Ожидает проверки преподавателем.</p>
          </Card>
        )}
        <p className="mt-3 text-xs text-zinc-400">Реальная сдача подключается к Moodle (mod_assign) на фазе интерактива.</p>
      </main>
    </div>
  );
}
