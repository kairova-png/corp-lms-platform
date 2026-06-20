import Link from "next/link";
import { getSiteInfo, getMyCourses } from "@/lib/moodle";
import { CourseCard } from "@/components/CourseCard";

export const dynamic = "force-dynamic";

export default async function MyLearning() {
  let mine: any[] = [];
  let error: string | null = null;
  try {
    const info = await getSiteInfo();
    mine = await getMyCourses(info.userid);
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink">Моё обучение</h1>
      <p className="mt-1 text-zinc-500">Курсы, на которые вы записаны.</p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 text-sm break-all">{error}</div>
      ) : mine.length === 0 ? (
        <p className="mt-6 text-zinc-500">
          Вы пока не записаны на курсы. Откройте <Link href="/catalog" className="text-brand font-semibold">каталог</Link>.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((c) => (
            <CourseCard key={c.id} course={c} enrolled />
          ))}
        </div>
      )}
    </div>
  );
}
