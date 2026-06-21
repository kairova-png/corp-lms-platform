import Link from "next/link";

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-sm text-zinc-500 hover:text-brand transition">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="w-full px-6 lg:px-8 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand text-brand-fg font-display font-bold">CL</span>
              <span className="font-display font-bold text-ink">Corp LMS</span>
            </div>
            <p className="mt-3 text-sm text-zinc-500 max-w-xs">
              Корпоративное обучение KMG PetroChem — курсы, тесты, сертификаты.
            </p>
          </div>
          <FooterCol title="Платформа" links={[["Каталог", "/catalog"], ["Моё обучение", "/my"], ["Сертификаты", "/certificates"]]} />
          <FooterCol title="Поддержка" links={[["Помощь", "#"], ["Документы", "#"], ["Контакты", "#"]]} />
          <div>
            <div className="text-sm font-semibold text-ink mb-3">Язык</div>
            <div className="flex gap-2">
              {["KZ", "RU", "EN"].map((l) => (
                <button
                  key={l}
                  className="px-2.5 py-1 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:border-brand hover:text-brand transition cursor-pointer"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between gap-2 text-xs text-zinc-400">
          <span>© 2026 Corp LMS · KMG PetroChem</span>
          <span>Все права защищены</span>
        </div>
      </div>
    </footer>
  );
}
