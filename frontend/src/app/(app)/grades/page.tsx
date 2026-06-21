import { getSiteInfo, getMyCourses, getGrades } from "@/lib/moodle";
import { Card, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Grades() {
  let courses: any[] = [];
  let uid = 0;
  try {
    const info = await getSiteInfo();
    uid = info.userid;
    courses = await getMyCourses(uid);
  } catch {
    // пусто
  }

  const data = await Promise.all(
    courses.map(async (c) => ({ course: c, items: await getGrades(c.id, uid) }))
  );

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-ink">Оценки</h1>
      <p className="mt-1 text-zinc-500">Ваши результаты по курсам.</p>

      {data.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Оценок пока нет" note="Результаты появятся после прохождения курсов." />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {data.map(({ course, items }) => (
            <Card key={course.id} className="p-5">
              <h2 className="font-display font-semibold text-ink">{course.fullname}</h2>
              {items.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-500">Нет оценок.</p>
              ) : (
                <div className="mt-3">
                  {/* Десктоп — таблица */}
                  <table className="hidden sm:table w-full text-sm">
                    <thead>
                      <tr className="text-left text-zinc-400 border-b border-zinc-100">
                        <th className="py-2 font-medium">Элемент</th>
                        <th className="py-2 font-medium">Оценка</th>
                        <th className="py-2 font-medium">Макс.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it: any, i: number) => (
                        <tr key={i} className="border-b border-zinc-50">
                          <td className="py-2 text-ink">{it.itemname || "Итог курса"}</td>
                          <td className="py-2 font-semibold text-ink">{it.gradeformatted || it.graderaw || "—"}</td>
                          <td className="py-2 text-zinc-400">{it.grademax ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Мобайл — карточки */}
                  <div className="sm:hidden space-y-2">
                    {items.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between py-2 border-b border-zinc-50">
                        <span className="text-ink">{it.itemname || "Итог курса"}</span>
                        <span className="font-semibold text-ink">{it.gradeformatted || it.graderaw || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
