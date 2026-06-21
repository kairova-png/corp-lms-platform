import { getCalendarEvents } from "@/lib/moodle";
import { Card, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

function fmt(ts: number): string {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return (
    d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) +
    ", " +
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  );
}

export default async function Calendar() {
  const events = await getCalendarEvents();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink">Календарь</h1>
      <p className="mt-1 text-zinc-500">Ближайшие события и дедлайны.</p>

      {events.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Событий нет" note="Запланированные курсы, вебинары и дедлайны появятся здесь." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {events.map((e: any) => (
            <Card key={e.id} className="p-4 flex items-center gap-4">
              <div className="grid place-items-center w-12 h-12 rounded-xl bg-surface text-brand flex-none">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold text-ink line-clamp-1">{e.name}</div>
                <div className="text-sm text-zinc-500 line-clamp-1">{e.course?.fullname || ""}</div>
              </div>
              <div className="text-sm text-zinc-500 flex-none text-right">{fmt(e.timesort || e.timestart)}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
