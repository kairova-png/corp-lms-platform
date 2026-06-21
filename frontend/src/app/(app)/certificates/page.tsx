import { getSiteInfo, getMyCourses } from "@/lib/moodle";
import { CertificateCard } from "@/components/CertificateCard";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Certificates() {
  let mine: any[] = [];
  try {
    const info = await getSiteInfo();
    mine = await getMyCourses(info.userid);
  } catch {
    // пусто
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink">Сертификаты</h1>
      <p className="mt-1 text-zinc-500">Сертификаты по вашим курсам.</p>

      {mine.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Сертификатов пока нет" note="Завершите курс — сертификат появится здесь." />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {mine.map((c) => (
            <CertificateCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
