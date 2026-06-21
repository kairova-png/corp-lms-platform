# PROGRESS — журнал прогресса и решений

> Обновлять каждую сессию. Цель: продолжить в новом контекстном окне без потери контекста.
> См. также `00_WAYS_OF_WORKING.md`, `03_UI_modernization_plan.md`, `04_roles_and_navigation.md`.

## Где мы (последнее обновление: сессия проектирования headless-ученика)

### Проект
- Репо: `/home/user/corp-lms-platform` (git). Тендерный анализ: `/home/user/lms-tender-kmg/docs/`.
- Цель: переиспользуемый дистрибутив Moodle + современный headless-фронт под тендеры РК (KMG PetroChem, лот 4459507).

### Как запустить
```bash
cd /home/user/corp-lms-platform
sg docker -c 'docker compose -f docker/docker-compose.yml --env-file .env up -d'
```
- Moodle: http://localhost:8080 (Windows-браузер), admin / CorpLms#Admin2026.
- Фронт: http://localhost:3000.
- Если WS не отвечает: `docker cp scripts/ws_bootstrap.php <app>:/tmp/ && exec app php /tmp/ws_bootstrap.php`, затем `purge_caches.php`. Токен демо-студента `demo1` лежит в `.env` (`MOODLE_WS_TOKEN`).

## ✅ Сделано и проверено
1. **Дистрибутив Moodle 4.5.12** в Docker (app + PostgreSQL 16 + Redis 7). Плагины из `config/plugins.json`: mod_customcert, qtype_ordering, mod_questionnaire, auth_saml2 + наши `theme_corplms`, `local_corplms`. Вебинары/отчёты — ядровые BBB/Report Builder.
2. **Тема `theme_corplms`** (child of Boost) — индиго-бренд (настройка `brandcolor`), Manrope/Source Sans через `<head>` (`additionalhtmlhead`). Активна, CSS проверен.
3. **Контент засеян** (идемпотентные сидеры): 3 видеокурса, 10 видеоуроков (`mod_page` + HTML5-плеер), 3 задания, 3 теста, 21 вопрос (7 типов, GIFT-импорт), 3 сертификата (15 элементов). Студент `demo1` записан.
4. **Web Services** включены и работают под токеном студента (439 функций). `core_enrol_get_users_courses`, `core_course_get_contents`, `mod_page_get_pages_by_courses`, `core_completion_*` — проверены.
5. **Фронт Next.js 16 / React 19 / Tailwind v4** (`frontend/`, compose-сервис):
   - `lib/moodle.ts` — серверный WS-клиент (`node:http`, Host-заголовок). Функции: siteInfo, myCourses, allCourses, courseById, courseContents, coursePages, completion, getUser.
   - **Оболочка ученика** `(app)/layout.tsx` = SiteHeader + Sidebar + main. Боковое меню (`components/Sidebar.tsx`, client, usePathname).
   - Экраны: **Главная/дашборд** `(app)/page.tsx` (статистика + «продолжить»), **Профиль** `(app)/profile/page.tsx` (реальные данные), **Каталог** `(app)/catalog`, **Моё обучение** `(app)/my`, **Курс** `(app)/course/[id]` (видео-плеер + программа).
   - Заглушки `ComingSoon` (без ссылок в Moodle): `/calendar`, `/grades`, `/certificates`.
   - Общие: `components/CourseCard.tsx`, `CourseView.tsx`, `SiteHeader.tsx`, `ComingSoon.tsx`.
   - Всё проверено end-to-end (реальные данные, без ошибок компиляции).
6. **Контент уроков + правило «без Moodle»:** текстовые уроки рендерятся во фронте (HTML из `mod_page`); все ссылки «Открыть в Moodle» убраны — тесты/задания/сертификаты дают inline-«Скоро». ADR-001 (стек TS/Next.js) записан в `00_WAYS_OF_WORKING.md`.
7. **Бренд KMG + UI-библиотека + Claude Design:** бренд kmgpetrochem.kz (teal #1896A7, Montserrat/Inter) применён; UI-библиотека `src/components/ui/` (10 компонентов) + `/styleguide` + `DESIGN_SYSTEM.md`; репо публичный на GitHub (kairova-png/corp-lms-platform). Схема: код = источник правды → синк в Claude Design (уровень 2 = упаковка в бандл, когда компоненты стабильны).
8. **Полноширинный лейаут + Udemy-курс + фокус-тест:** убран max-width (сетки до 5 колонок); страница курса в стиле Udemy (видео слева, вкладки Описание/Материалы/Тесты под видео, программа справа); тест открывается в **новой вкладке** `/test/[id]/[cmid]` (фокус-режим без сайдбара, `QuizRunner` — UI всех типов вопросов; WS `mod_quiz_*` — следующая фаза).
9. **Каркас + все контент-экраны ученика (план Ralph `fix_plan.md`):** верхнее меню + **мобильный бургер-drawer** (`MobileNav`) + глобальный **футер**; мобильный адаптив (сетки, стек, таблицы→карточки). Экраны: **Вход** (`/login`), **Профиль + редактирование** (`/profile/edit`), **Сертификаты** (`/certificates` + `/[id]` детальный), **Календарь**, **Оценки** (`gradereport`), **Уведомления** (`/notifications` + колокол), **Задание** (фокус `/assignment/[id]/[cmid]`). Все на наших ui-компонентах, бренд KMG, без ссылок в Moodle. Документ-вьюер отложен (нет файлового контента). Запушено на GitHub.
10. **Секция 4 — реальные WS (оживление):** ✅ **Тест** (`mod_quiz`): вопросы Moodle рендерятся в нашем UI, ответы → `process_attempt`, оценка из `get_user_best_grade`; API `/api/quiz/{start,finish}`. ✅ **Задание** (`mod_assign`): реальная сдача online-текста, статус/оценка; API `/api/assignment/submit`. Оба пишутся/оцениваются в Moodle (подтверждено по БД). Осталось: сертификат-PDF, настоящий логин, SCORM, загрузка файлов.

## 🧭 Стратегический вывод по тендеру (важно)
Лот 4459507 — это **«доступ к готовой LMS», НЕ разработка** (название «услуги по предоставлению доступа», оплата за период, бюджет ~7 млн ₸). Заказчик ждёт **готовый продукт**, не постройку с нуля. Самые тяжёлые требования (бюджетирование 3.3, IDP/360/performance 3.1, Киркпатрик L3-L4) — НЕ про обучение, их нет ни в бесплатном Moodle, ни в Workplace → кастом/интеграция, за 7 млн нерентабельно. **Наш `corp-lms-platform` = тот самый готовый продукт для «access»-тендеров.** Перед подачей — уточнить у заказчика, какие фичи обязательны в MVP. Детали: `/home/user/lms-tender-kmg/docs/03_Реальность_закупки.md`.

## Решения (зафиксированы)
- A+C → уточнено: **новый дизайн только для УЧЕНИКА** (headless, ничего в Moodle). Авторинг/админка = Moodle. (Подтверждено пользователем: «создание курсов это и есть админка, переписывать не надо».)
- Дизайн-система: индиго `#4F46E5`, success `#22C55E`, Manrope + Source Sans 3.
- Сложные интерактивы строим в новом UI через mobile-WS (как офиц. приложение). Для ещё-не-готовых типов — заглушка «скоро», **не** ссылка в Moodle.

## 🎨 Бренд клиента + GitHub + Claude Design (новое)
- **Бренд KMG PetroChem** извлечён из kmgpetrochem.kz и применён: teal `#1896A7`, accent `#30A6A6`, ink `#18303A`, surface `#EEF3F5`; шрифты **Montserrat + Inter** (кириллица). Фронт (`globals.css`/`layout.tsx`) и Moodle-тема `brandcolor` обновлены. См. `docs/05_brand_kmg.md`.
- **GitHub:** код запушен в приватный репо **https://github.com/kairova-png/corp-lms-platform** (gh CLI в `~/.local/bin`, аккаунт kairova-png). `.env`/токены в .gitignore — не утекли.
- **Workflow с Claude Design:** пользователь строит дизайн в claude.ai/design (линкует наш репо как design-system source, бренд в notes), даёт мне **ссылку на проект** → я читаю через **DesignSync** (`list_files`/`get_file` по projectId из URL `/design/p/<id>`) и реализую в коде. (Скилл `/design-sync` пушит репу В Claude Design; чтение проекта — методами DesignSync.)

## ✅ Решения (подтверждены пользователем)
1. **Объём ролей в новом UI: только Ученик.** Куратор/админ — в Moodle.
2. **Логин:** пока собираем экраны на демо-токене; настоящий per-user вход — отдельной фазой.
3. **Порядок фаз:** навигация+профиль+дашборд+просмотр (✅ сделано) → потом интерактив.

## ▶️ Следующие шаги
1. **Просмотр-контент в курсе:** урок-текст/лонгрид (рендер HTML из `mod_page`), документ-вьюер (pdf/pptx через прокси), скачиваемые файлы.
2. **Сертификаты (реально):** список выданных + скачивание PDF (проверить WS `mod_customcert_*`; если нет — через `local_corplms` external function + pluginfile-прокси).
3. **Оценки/Календарь (реально):** `gradereport_user_get_grade_items`, `core_calendar_get_calendar_*`.
4. **Интерактив фазами:** тест-плеер (`mod_quiz_*`), задания (`mod_assign_*`), опросы (`mod_feedback_*`), SCORM (`mod_scorm_*`). Для ещё-не-готовых — `ComingSoon`, не ссылка в Moodle.
5. **Прокси `pluginfile`** на сервере фронта (файлы/видео с токеном, не светя его в браузер).
6. **Настоящий логин** (Moodle credentials → персональный токен), затем AD/SSO.
7. Самохостинг шрифтов под on-prem; адаптив (моб. меню — сейчас сайдбар `hidden md:block`).

## Ключевые грабли — см. `00_WAYS_OF_WORKING.md` (Docker/WSL/Host/WS).
