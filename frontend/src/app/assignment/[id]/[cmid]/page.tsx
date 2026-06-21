import { getCourseContents } from "@/lib/moodle";
import { AssignmentView } from "@/components/AssignmentView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Задание — Corp LMS" };

export default async function AssignmentPage({ params }: { params: Promise<{ id: string; cmid: string }> }) {
  const { id, cmid } = await params;
  let name = "Задание";
  let desc = "";
  try {
    const sections = await getCourseContents(Number(id));
    for (const s of sections) {
      for (const m of s.modules || []) {
        if (String(m.id) === cmid) {
          name = m.name;
          desc = (m.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        }
      }
    }
  } catch {
    // имя по умолчанию
  }
  return <AssignmentView name={name} desc={desc} />;
}
