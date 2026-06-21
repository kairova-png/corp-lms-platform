import { NextResponse } from "next/server";
import { quizGetId, quizUnfinished, quizStart, quizGetData } from "@/lib/moodle";

export async function POST(req: Request) {
  try {
    const { courseid, cmid } = await req.json();
    const quizid = await quizGetId(Number(courseid), Number(cmid));
    if (!quizid) return NextResponse.json({ error: "Тест не найден" }, { status: 404 });

    let attemptid = await quizUnfinished(quizid);
    if (!attemptid) attemptid = await quizStart(quizid);

    const questions: any[] = [];
    let page = 0;
    for (let i = 0; i < 60; i++) {
      const d = await quizGetData(attemptid, page);
      if (d?.exception) break;
      for (const q of d.questions ?? []) {
        questions.push({
          slot: q.slot,
          type: q.type,
          html: (q.html || "").replace(/<script[\s\S]*?<\/script>/gi, ""),
        });
      }
      if (typeof d.nextpage !== "number" || d.nextpage < 0) break;
      page = d.nextpage;
    }

    return NextResponse.json({ attemptid, quizid, questions });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
