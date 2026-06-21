import { NextResponse } from "next/server";
import { quizProcess, quizBestGrade } from "@/lib/moodle";

export async function POST(req: Request) {
  try {
    const { attemptid, quizid, data } = await req.json();
    await quizProcess(Number(attemptid), data ?? [], true);
    const grade = await quizBestGrade(Number(quizid));
    return NextResponse.json({ grade });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
