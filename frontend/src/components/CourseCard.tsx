import Link from "next/link";

const GRADIENTS = [
  "from-indigo-500 to-violet-500",
  "from-teal-500 to-emerald-500",
  "from-sky-500 to-indigo-500",
  "from-fuchsia-500 to-indigo-500",
  "from-amber-500 to-orange-500",
];

function stripHtml(s: string): string {
  return (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function CourseCard({ course, enrolled }: { course: any; enrolled: boolean }) {
  const g = GRADIENTS[course.id % GRADIENTS.length];
  const letter = (course.fullname || "K").trim()[0]?.toUpperCase() ?? "K";
  return (
    <Link
      href={`/course/${course.id}`}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm transition hover:shadow-md hover:border-brand/40"
    >
      <div className={`h-28 bg-gradient-to-br ${g} relative`}>
        <span className="absolute left-4 top-3 font-display font-bold text-white/95 text-3xl">{letter}</span>
        {enrolled && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-brand">
            Записан
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">{course.shortname}</span>
        <h3 className="mt-1.5 font-display font-semibold text-ink leading-snug line-clamp-2">{course.fullname}</h3>
        <p className="mt-1.5 text-sm text-zinc-500 line-clamp-2 flex-1">
          {stripHtml(course.summary) || "Видеокурс корпоративной академии."}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
          <span>{course.enrolledusercount ?? 0} учащихся</span>
          <span className="font-semibold text-brand group-hover:translate-x-0.5 transition">
            {enrolled ? "Продолжить →" : "Открыть →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
