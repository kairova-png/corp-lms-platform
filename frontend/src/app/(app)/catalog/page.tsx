import { getSiteInfo, getMyCourses, getAllCourses } from "@/lib/moodle";
import { CourseCard } from "@/components/CourseCard";

export const dynamic = "force-dynamic";

export default async function Catalog() {
  let all: any[] = [];
  let mine: any[] = [];
  let error: string | null = null;
  try {
    const info = await getSiteInfo();
    [all, mine] = await Promise.all([getAllCourses(), getMyCourses(info.userid)]);
  } catch (e) {
    error = (e as Error).message;
  }
  const mineIds = new Set(mine.map((c) => c.id));

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink">Каталог курсов</h1>
      <p className="mt-1 text-zinc-500">Видеокурсы, тесты и сертификаты корпоративной академии.</p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 text-sm break-all">{error}</div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((c) => (
            <CourseCard key={c.id} course={c} enrolled={mineIds.has(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
