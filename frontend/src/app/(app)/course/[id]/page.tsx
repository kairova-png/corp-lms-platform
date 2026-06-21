import Link from "next/link";
import {
  getCourseById,
  getCourseContents,
  getCoursePages,
  getSiteInfo,
  getCompletion,
} from "@/lib/moodle";
import { CourseView, type Section } from "@/components/CourseView";

export const dynamic = "force-dynamic";

function extractVideo(html: string): string | null {
  const m =
    (html || "").match(/<video[^>]*\ssrc="([^"]+)"/i) ||
    (html || "").match(/src="([^"]+\.mp4[^"]*)"/i);
  return m ? m[1] : null;
}
function extractDesc(html: string): string {
  return (html || "")
    .replace(/<video[\s\S]*?<\/video>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseid = Number(id);

  let course: any = null;
  let sections: any[] = [];
  let pages: any[] = [];
  let done: number[] = [];
  let error: string | null = null;

  try {
    const info = await getSiteInfo();
    [course, sections, pages] = await Promise.all([
      getCourseById(courseid),
      getCourseContents(courseid),
      getCoursePages(courseid),
    ]);
    const comp = await getCompletion(courseid, info.userid);
    done = comp.filter((s: any) => s.state === 1).map((s: any) => s.cmid);
  } catch (e) {
    error = (e as Error).message;
  }

  if (error) {
    return (
      <div>
        <Link href="/catalog" className="text-sm text-brand">← Каталог</Link>
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 text-sm break-all">{error}</div>
      </div>
    );
  }

  const stripScripts = (h: string) => (h || "").replace(/<script[\s\S]*?<\/script>/gi, "");

  const pageByCmid = new Map<number, { video: string | null; desc: string; html: string }>();
  for (const p of pages) {
    pageByCmid.set(p.coursemodule, {
      video: extractVideo(p.content),
      desc: extractDesc(p.content),
      html: stripScripts(p.content),
    });
  }

  const curriculum: Section[] = (sections || [])
    .filter((s: any) => s.section > 0 && (s.modules || []).some((m: any) => m.modname !== "label"))
    .map((s: any) => ({
      title: s.name,
      items: (s.modules || [])
        .filter((m: any) => m.modname !== "label")
        .map((m: any) => {
          const pg = pageByCmid.get(m.id);
          const isPage = m.modname === "page";
          return {
            cmid: m.id,
            name: m.name,
            type: m.modname,
            video: isPage ? pg?.video ?? null : null,
            desc: isPage ? pg?.desc ?? "" : "",
            // HTML текстового урока показываем, только если в нём нет видео
            html: isPage && !pg?.video ? pg?.html ?? "" : "",
          };
        }),
    }));

  return (
    <div>
      <Link href="/catalog" className="text-sm text-brand">← Каталог</Link>
      <div className="mt-3 rounded-2xl bg-ink text-white p-6 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">{course?.fullname}</h1>
        <p className="mt-2 text-white/70 text-sm max-w-2xl">
          {(course?.summary || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
        </p>
      </div>
      <CourseView
        courseId={courseid}
        summary={(course?.summary || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
        curriculum={curriculum}
        doneCmids={done}
      />
    </div>
  );
}
