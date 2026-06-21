import { getSiteInfo, getNotifications } from "@/lib/moodle";
import { Card, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

function fmt(ts: number): string {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function Notifications() {
  let items: any[] = [];
  try {
    const info = await getSiteInfo();
    items = await getNotifications(info.userid);
  } catch {
    // пусто
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink">Уведомления</h1>
      <p className="mt-1 text-zinc-500">Сообщения системы и о ходе обучения.</p>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Уведомлений нет" note="Здесь появятся уведомления о назначениях, дедлайнах и результатах." />
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {items.map((n: any) => (
            <Card key={n.id} className={`p-4 flex gap-3 ${n.read ? "" : "border-brand/30 bg-surface/40"}`}>
              <span className={`mt-1.5 w-2 h-2 rounded-full flex-none ${n.read ? "bg-zinc-300" : "bg-brand"}`} />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-ink line-clamp-1">{n.subject || n.smallmessage || "Уведомление"}</div>
                <div className="text-sm text-zinc-500 line-clamp-2">{(n.smallmessage || "").replace(/<[^>]*>/g, " ")}</div>
              </div>
              <div className="text-xs text-zinc-400 flex-none">{fmt(n.timecreated)}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
