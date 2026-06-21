import Link from "next/link";
import { getSiteInfo, getCourseById } from "@/lib/moodle";
import { Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function CertDetail({ params }: { params: Promise<{ courseid: string }> }) {
  const { courseid } = await params;
  let fullname = "";
  let course: any = null;
  try {
    const info = await getSiteInfo();
    fullname = info.fullname;
    course = await getCourseById(Number(courseid));
  } catch {
    // пусто
  }

  return (
    <div className="max-w-3xl">
      <Link href="/certificates" className="text-sm text-brand">← Сертификаты</Link>

      <div className="mt-4 rounded-2xl border-4 border-brand/15 bg-white p-8 sm:p-12 text-center shadow-sm">
        <div className="text-xs uppercase tracking-[0.3em] text-brand font-semibold">KMG PetroChem</div>
        <h1 className="mt-5 text-3xl sm:text-4xl font-display font-bold text-ink">СЕРТИФИКАТ</h1>
        <p className="mt-4 text-zinc-500">настоящим подтверждается, что</p>
        <p className="mt-2 text-2xl font-display font-bold text-ink">{fullname || "Сотрудник"}</p>
        <p className="mt-4 text-zinc-500">успешно прошёл(ла) курс</p>
        <p className="mt-1 text-lg font-semibold text-brand">{course?.fullname || "Курс"}</p>
        <p className="mt-8 text-sm text-zinc-400">Дата выдачи: __.__.2026 · № CL-{courseid}</p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button type="button" className="flex-1">Скачать PDF</Button>
        <Link href="/certificates" className="flex-1">
          <Button type="button" variant="secondary" className="w-full">К списку</Button>
        </Link>
      </div>
      <p className="mt-3 text-xs text-zinc-400">Скачивание PDF подключается к Moodle (mod_customcert) на фазе интерактива.</p>
    </div>
  );
}
