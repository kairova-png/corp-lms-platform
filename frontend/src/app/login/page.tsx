import Link from "next/link";
import { Button, Card, Input } from "@/components/ui";

export const metadata = { title: "Вход — Corp LMS" };

export default function Login() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Бренд-панель */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-12">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand font-display font-bold">CL</span>
          <span className="font-display font-bold text-xl">Corp LMS</span>
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold leading-tight">Корпоративная академия<br />KMG PetroChem</h1>
          <p className="mt-3 text-white/70 max-w-md">Видеокурсы, тесты и сертификаты для сотрудников — в одном месте.</p>
        </div>
        <p className="text-white/40 text-sm">© 2026 Corp LMS</p>
      </div>

      {/* Форма */}
      <div className="flex items-center justify-center p-6 bg-[var(--background)]">
        <Card className="w-full max-w-sm p-8">
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand text-brand-fg font-display font-bold">CL</span>
            <span className="font-display font-bold text-xl text-ink">Corp LMS</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-ink">Вход</h2>
          <p className="mt-1 text-sm text-zinc-500">Войдите в корпоративную академию</p>
          <form className="mt-6 space-y-4">
            <Input label="Логин или e-mail" type="text" placeholder="you@kmgpetrochem.kz" autoComplete="username" />
            <Input label="Пароль" type="password" placeholder="••••••••" autoComplete="current-password" />
            <Button type="button" className="w-full" size="lg">Войти</Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="#" className="text-sm text-brand hover:underline">Забыли пароль?</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
