import {
  Button,
  Badge,
  Card,
  Avatar,
  ProgressBar,
  ProgressRing,
  StatTile,
  Input,
  Tabs,
  EmptyState,
} from "@/components/ui";

export const dynamic = "force-static";
export const metadata = { title: "Corp LMS — Design System" };

const COLORS = [
  ["brand", "#1896A7"],
  ["brand-dark", "#15808F"],
  ["accent", "#30A6A6"],
  ["ink", "#18303A"],
  ["surface", "#EEF3F5"],
  ["success", "#22C55E"],
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-display font-bold text-ink mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-ink">Corp LMS — Design System</h1>
        <p className="mt-1 text-zinc-500">Бренд KMG PetroChem · Montserrat + Inter · teal #1896A7</p>
      </header>

      <Section title="Цвета">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COLORS.map(([name, hex]) => (
            <div key={name} className="rounded-xl border border-zinc-200 overflow-hidden">
              <div className="h-16" style={{ background: hex }} />
              <div className="p-2 text-xs">
                <div className="font-semibold text-ink">{name}</div>
                <div className="text-zinc-400">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Типографика">
        <div className="space-y-2">
          <p className="text-3xl font-display font-bold text-ink">Заголовок H1 · Montserrat 32</p>
          <p className="text-2xl font-display font-semibold text-ink">Заголовок H2 · 24</p>
          <p className="text-xl font-display font-semibold text-ink">Заголовок H3 · 20</p>
          <p className="text-base text-zinc-700">Основной текст · Inter 16 — Қарағанды, Атырау, обучение.</p>
          <p className="text-sm text-zinc-500">Вторичный текст · 14</p>
        </div>
      </Section>

      <Section title="Кнопки">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="Бейджи">
        <div className="flex flex-wrap gap-3">
          <Badge tone="brand">Записан</Badge>
          <Badge tone="success">Пройдено</Badge>
          <Badge tone="neutral">Черновик</Badge>
          <Badge tone="warning">Дедлайн</Badge>
        </div>
      </Section>

      <Section title="Прогресс">
        <div className="flex items-center gap-8">
          <div className="w-64">
            <ProgressBar value={68} />
          </div>
          <ProgressRing value={68} />
          <ProgressRing value={32} size={56} />
        </div>
      </Section>

      <Section title="Статистика (дашборд)">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatTile value={4} label="Курсов в обучении" />
          <StatTile value="68%" label="Средний прогресс" />
          <StatTile value={3} label="Сертификатов" />
        </div>
      </Section>

      <Section title="Аватар / Карточка / Поле">
        <div className="grid sm:grid-cols-3 gap-4 items-start">
          <Card className="p-5 flex items-center gap-3">
            <Avatar name="Айгерим Демо" />
            <div>
              <div className="font-display font-semibold text-ink">Айгерим Демо</div>
              <div className="text-sm text-zinc-500">demo1@corp-lms.kz</div>
            </div>
          </Card>
          <Card className="p-5">
            <Input label="Email" placeholder="you@kmgpetrochem.kz" hint="Корпоративная почта" />
          </Card>
          <Card className="p-5">
            <Input label="Код" error="Неверный код" defaultValue="0000" />
          </Card>
        </div>
      </Section>

      <Section title="Табы">
        <Tabs
          tabs={[
            { label: "Обзор", content: <p className="text-zinc-600">Содержимое вкладки «Обзор».</p> },
            { label: "Программа", content: <p className="text-zinc-600">Содержимое вкладки «Программа».</p> },
            { label: "Отзывы", content: <p className="text-zinc-600">Содержимое вкладки «Отзывы».</p> },
          ]}
        />
      </Section>

      <Section title="Пустое состояние">
        <EmptyState title="Сертификатов пока нет" note="Завершите курс — сертификат появится здесь." />
      </Section>
    </div>
  );
}
