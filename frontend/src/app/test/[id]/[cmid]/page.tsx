import { getCourseContents } from "@/lib/moodle";
import { QuizRunner } from "@/components/QuizRunner";

export const dynamic = "force-dynamic";
export const metadata = { title: "Тест — Corp LMS" };

export default async function TestPage({ params }: { params: Promise<{ id: string; cmid: string }> }) {
  const { id, cmid } = await params;
  let name = "Итоговый тест";
  try {
    const sections = await getCourseContents(Number(id));
    for (const s of sections) {
      for (const m of s.modules || []) {
        if (String(m.id) === cmid && m.modname === "quiz") name = m.name;
      }
    }
  } catch {
    // имя по умолчанию
  }
  return <QuizRunner quizName={name} courseId={Number(id)} cmid={Number(cmid)} />;
}
