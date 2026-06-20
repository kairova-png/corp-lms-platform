# Corp LMS — Design System

Дизайн-система фронтенда корпоративной LMS (headless над Moodle) для **KMG PetroChem**.
Стек: Next.js 16 · React 19 · Tailwind v4. Живой styleguide: **`/styleguide`**.

## Бренд (KMG PetroChem)
Извлечён из kmgpetrochem.kz. Источник токенов — `src/app/globals.css` (`@theme`).

| Роль | Token (Tailwind) | HEX |
|---|---|---|
| Brand (primary) | `brand` / `bg-brand` `text-brand` | `#1896A7` (teal) |
| Brand dark (hover) | `brand-dark` | `#15808F` |
| Brand foreground | `brand-fg` | `#FFFFFF` |
| Accent | `accent` | `#30A6A6` |
| Ink (тёмный текст/навбар) | `ink` | `#18303A` |
| Surface (мягкий фон) | `surface` | `#EEF3F5` |
| Success (прогресс) | `success` | `#22C55E` |

**Шрифты:** заголовки — **Montserrat** (`font-display`), текст — **Inter** (`font-sans`). Оба с кириллицей (KZ/RU).
**Радиусы:** 8 (кнопки) · 12–16 (карточки) · 999 (пилюли/бейджи). **Тени:** мягкие `shadow-sm`.
**Движение:** 150–250ms; уважать `prefers-reduced-motion`.

## Компоненты (`src/components/ui/`)
| Компонент | Файл | Назначение / варианты |
|---|---|---|
| `Button` | `Button.tsx` | primary / secondary / ghost / danger × sm/md/lg; состояния hover/focus/disabled |
| `Badge` | `Badge.tsx` | tone: brand / success / neutral / warning |
| `Card` | `Card.tsx` | базовая поверхность (rounded-2xl, border, shadow) |
| `Avatar` | `Avatar.tsx` | инициалы на бренд-фоне, размер настраивается |
| `ProgressBar` | `ProgressBar.tsx` | линейный прогресс (success) |
| `ProgressRing` | `ProgressRing.tsx` | кольцевой прогресс с % в центре (brand) |
| `StatTile` | `StatTile.tsx` | KPI-плитка дашборда (значение + подпись + иконка) |
| `Input` | `Input.tsx` | поле с label / hint / error |
| `Tabs` | `Tabs.tsx` | вкладки |
| `EmptyState` | `EmptyState.tsx` | пусто / «скоро» |

Доменные (LMS): `CourseCard`, `CourseView` (плеер + программа), `Sidebar`, `SiteHeader`, `ComingSoon`.

## Принципы
- **Без переходов в Moodle** — весь опыт ученика внутри этого UI.
- **Доступность**: контраст ≥ 4.5:1, видимый focus, тач-зоны ≥ 44px, тексты RU/KZ.
- **Адаптив**: 375 / 768 / 1024 / 1440.
- **Единый источник токенов** — `globals.css @theme`; компоненты переиспользуются, не дублируются.

## Экраны (`src/app/(app)/`)
Дашборд (`/`), Каталог (`/catalog`), Моё обучение (`/my`), Курс (`/course/[id]`), Профиль (`/profile`),
Календарь / Оценки / Сертификаты (заглушки `EmptyState`). Оболочка — `(app)/layout.tsx` (Sidebar + Topbar).
