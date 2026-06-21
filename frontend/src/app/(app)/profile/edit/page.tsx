import Link from "next/link";
import { getSiteInfo, getUser } from "@/lib/moodle";
import { Button, Card, Input } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProfileEdit() {
  let user: any = null;
  try {
    const info = await getSiteInfo();
    user = (await getUser(info.userid)) ?? { fullname: info.fullname };
  } catch {
    user = {};
  }
  const [firstname, ...rest] = (user?.fullname || "").split(" ");

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Редактирование профиля</h1>
        <Link href="/profile" className="text-sm text-brand">← Назад</Link>
      </div>

      <Card className="p-6">
        <form className="grid sm:grid-cols-2 gap-4">
          <Input label="Имя" defaultValue={firstname} />
          <Input label="Фамилия" defaultValue={rest.join(" ")} />
          <Input label="E-mail" type="email" defaultValue={user?.email} className="sm:col-span-2" />
          <Input label="Телефон" defaultValue={user?.phone1 || user?.phone2} />
          <Input label="Подразделение" defaultValue={user?.department || user?.institution} />
          <Input label="Город" defaultValue={user?.city} className="sm:col-span-2" />

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <Button type="button" className="flex-1">Сохранить</Button>
            <Link href="/profile" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">Отмена</Button>
            </Link>
          </div>
        </form>
        <p className="mt-4 text-xs text-zinc-400">Сохранение профиля подключается к Moodle (core_user_update_users) на фазе интерактива.</p>
      </Card>
    </div>
  );
}
