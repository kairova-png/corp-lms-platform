"use client";

// Реальная попытка теста через Moodle WS (mod_quiz_*), оркестрация в /api/quiz/*.
// Вопросы приходят как HTML, отрендеренный Moodle — показываем в нашей карточке,
// собираем ответы из формы и отправляем в process_attempt; оценка из get_attempt_review.

import { useState, useRef } from "react";
import { Button, Card, ProgressBar, Badge } from "@/components/ui";

type Q = { slot: number; type: string; html: string };
type Stage = "start" | "loading" | "quiz" | "submitting" | "result" | "error";

export function QuizRunner({
  quizName,
  courseId,
  cmid,
  passmark = 70,
}: {
  quizName: string;
  courseId: number;
  cmid: number;
  passmark?: number;
}) {
  const [stage, setStage] = useState<Stage>("start");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [attemptid, setAttemptid] = useState<number | null>(null);
  const [quizid, setQuizid] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const [grade, setGrade] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const total = questions.length;

  const start = async () => {
    setStage("loading");
    try {
      const r = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseid: courseId, cmid }),
      });
      const d = await r.json();
      if (d.error || !d.questions?.length) throw new Error(d.error || "Нет вопросов");
      setAttemptid(d.attemptid);
      setQuizid(d.quizid);
      setQuestions(d.questions);
      setIdx(0);
      setStage("quiz");
    } catch (e) {
      setErr((e as Error).message);
      setStage("error");
    }
  };

  const finish = async () => {
    setStage("submitting");
    const data: { name: string; value: string }[] = [];
    formRef.current
      ?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input,select,textarea")
      .forEach((el) => {
        const type = (el as HTMLInputElement).type;
        if ((type === "radio" || type === "checkbox") && !(el as HTMLInputElement).checked) return;
        if (!el.name) return;
        data.push({ name: el.name, value: (el as HTMLInputElement).value });
      });
    try {
      const r = await fetch("/api/quiz/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptid, quizid, data }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setGrade(d.grade);
      setStage("result");
    } catch (e) {
      setErr((e as Error).message);
      setStage("error");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-ink text-white">
        <div className="w-full px-6 h-14 flex items-center justify-between">
          <span className="font-display font-semibold truncate">{quizName}</span>
          <button onClick={() => window.close()} className="text-white/70 hover:text-white text-sm cursor-pointer">Закрыть ✕</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {stage === "start" && (
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-display font-bold text-ink">{quizName}</h1>
            <p className="mt-2 text-zinc-500">Проверьте знания по курсу. Проходной балл — {passmark}%.</p>
            <Button size="lg" className="mt-8 w-full" onClick={start}>Начать тест</Button>
          </Card>
        )}

        {(stage === "loading" || stage === "submitting") && (
          <div className="text-center py-24 text-zinc-500">{stage === "loading" ? "Загружаем вопросы…" : "Отправляем ответы…"}</div>
        )}

        {stage === "error" && (
          <Card className="p-8 text-center">
            <p className="text-red-600 break-all">{err}</p>
            <Button className="mt-4" onClick={() => setStage("start")}>Назад</Button>
          </Card>
        )}

        {stage === "quiz" && (
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-between text-sm text-zinc-500 mb-2">
              <span>Вопрос {idx + 1} из {total}</span>
            </div>
            <ProgressBar value={((idx + 1) / total) * 100} className="mb-6" />

            {questions.map((q, i) => (
              <div key={q.slot} style={{ display: i === idx ? "block" : "none" }}>
                <Card className="p-6">
                  <div
                    className="quiz-question [&_.qtext]:text-lg [&_.qtext]:font-display [&_.qtext]:font-semibold [&_.qtext]:text-ink [&_.answer]:mt-5 [&_.answer>div]:flex [&_.answer>div]:items-start [&_.answer>div]:gap-2 [&_.answer>div]:rounded-xl [&_.answer>div]:border [&_.answer>div]:border-zinc-200 [&_.answer>div]:p-3 [&_.answer>div]:mb-2 [&_input]:mt-1 [&_label]:cursor-pointer [&_.prompt]:font-medium [&_input[type=text]]:border [&_input[type=text]]:border-zinc-300 [&_input[type=text]]:rounded-lg [&_input[type=text]]:px-3 [&_input[type=text]]:py-2 [&_select]:border [&_select]:border-zinc-300 [&_select]:rounded-lg [&_select]:px-2 [&_select]:py-1"
                    dangerouslySetInnerHTML={{ __html: q.html }}
                  />
                </Card>
              </div>
            ))}

            <div className="mt-6 flex justify-between">
              <Button type="button" variant="ghost" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>Назад</Button>
              {idx < total - 1 ? (
                <Button type="button" onClick={() => setIdx((i) => i + 1)}>Далее</Button>
              ) : (
                <Button type="button" onClick={finish}>Завершить</Button>
              )}
            </div>
          </form>
        )}

        {stage === "result" && grade !== null && (
          <Card className="p-8 text-center">
            <div className="mx-auto grid place-items-center w-20 h-20 rounded-full" style={{ background: grade >= passmark ? "#dcfce7" : "#fee2e2" }}>
              <span className="text-2xl font-display font-bold" style={{ color: grade >= passmark ? "#16a34a" : "#dc2626" }}>{Math.round(grade)}%</span>
            </div>
            <h1 className="mt-4 text-xl font-display font-bold text-ink">{grade >= passmark ? "Тест пройден" : "Тест не пройден"}</h1>
            <div className="mt-2"><Badge tone={grade >= passmark ? "success" : "warning"}>Проходной балл {passmark}%</Badge></div>
            <div className="mt-8 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => window.location.reload()}>Ещё попытка</Button>
              <Button className="flex-1" onClick={() => window.close()}>Закрыть</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
