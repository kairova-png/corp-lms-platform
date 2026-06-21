import Link from "next/link";
import { getSiteInfo, getMyCourses } from "@/lib/moodle";
import { CourseCard } from "@/components/CourseCard";

export const dynamic = "force-dynamic";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-2xl font-display font-bold text-ink">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </div>
  );
}

export default async function Dashboard() {
  let firstname = "коллега";
  let mine: any[] = [];
  let error: string | null = null;
  try {
    const info = await getSiteInfo();
    firstname = info.fullname.split(" ")[0] || firstname;
    mine = await getMyCourses(info.userid);
  } catch (e) {
    error = (e as Error).message;
  }

  const inProgress = mine.filter((c) => (c.progress ?? 0) < 100);
  const avg = mine.length
    ? Math.round(mine.reduce((s, c) => s + (typeof c.progress === "number" ? c.progress : 0), 0) / mine.length)
    : 0;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink">Здравствуйте, {firstname}</h1>
      <p className="mt-1 text-zinc-500">Продолжайте обучение с того места, где остановились.</p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 text-sm break-all">{error}</div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Stat value={mine.length} label="Курсов в обучении" />
            <Stat value={`${avg}%`} label="Средний прогресс" />
            <Stat value={inProgress.length} label="Не завершено" />
          </div>

          <section className="mt-8">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-bold text-ink">Продолжить обучение</h2>
              <Link href="/my" className="text-sm font-semibold text-brand">Все мои курсы →</Link>
            </div>
            {mine.length === 0 ? (
              <p className="text-zinc-500">
                Вы пока не записаны на курсы. Загляните в <Link href="/catalog" className="text-brand font-semibold">каталог</Link>.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {(inProgress.length ? inProgress : mine).slice(0, 6).map((c) => (
                  <CourseCard key={c.id} course={c} enrolled />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
