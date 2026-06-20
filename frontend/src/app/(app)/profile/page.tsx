import { getSiteInfo, getUser, getMyCourses } from "@/lib/moodle";

export const dynamic = "force-dynamic";

function initials(name: string): string {
  return (name || "").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="py-3 border-b border-zinc-100 last:border-0">
      <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-0.5 text-ink">{value || "—"}</div>
    </div>
  );
}

export default async function Profile() {
  let user: any = null;
  let courses: any[] = [];
  let error: string | null = null;
  try {
    const info = await getSiteInfo();
    [user, courses] = await Promise.all([getUser(info.userid), getMyCourses(info.userid)]);
    if (!user) user = { fullname: info.fullname };
  } catch (e) {
    error = (e as Error).message;
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-ink">Профиль</h1>
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 text-sm break-all">{error}</div>
      </div>
    );
  }

  const department = user?.department || user?.institution;
  const city = user?.city;
  const country = user?.country;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Профиль</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Карточка */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center">
          <div className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-brand text-brand-fg font-display font-bold text-2xl">
            {initials(user?.fullname)}
          </div>
          <div className="mt-4 font-display font-semibold text-lg text-ink">{user?.fullname}</div>
          <div className="text-sm text-zinc-500">{user?.email}</div>
          <button
            disabled
            className="mt-5 w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-400 cursor-not-allowed"
            title="Скоро"
          >
            Редактировать (скоро)
          </button>
        </div>

        {/* Данные */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-display font-semibold text-ink mb-2">Личные данные</h2>
            <Field label="ФИО" value={user?.fullname} />
            <Field label="E-mail" value={user?.email} />
            <Field label="Телефон" value={user?.phone1 || user?.phone2} />
            <Field label="Подразделение" value={department} />
            <Field label="Город" value={[city, country].filter(Boolean).join(", ")} />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-display font-semibold text-ink mb-1">Обучение</h2>
            <p className="text-sm text-zinc-500">
              Записан на <span className="font-semibold text-ink">{courses.length}</span> курс(ов).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
