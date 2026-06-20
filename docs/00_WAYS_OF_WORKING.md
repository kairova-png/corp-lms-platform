# Правила работы (ways of working)

## Главное правило: сверяться с офиц. доками Moodle
Перед любой работой с Moodle (API, плагины, WS, темы) — **сначала читать moodledev.io**, не действовать по памяти.
- Корень: https://moodledev.io/docs/ (актуальная) и https://moodledev.io/docs/5.3 (LTS).
- ⚠️ **Наш Moodle = 4.5.12**, а доки часто 5.x. API в основном совместимы, но при сомнении проверять путь `/docs/4.5/...`.

### Ключевые разделы доков
| Тема | Путь |
|---|---|
| API-гайды | `/docs/5.3/apis` |
| Web Services / external functions | `/docs/5.3/apis/subsystems/external/functions` |
| Гайды по фичам | `/docs/5.3/guides` |
| Getting started | `/general/development/gettingstarted` |
| Moodle App (mobile WS — наш ориентир для headless) | `/general/app` |

### Паттерн external function (для нашего `local_corplms`)
- Класс: `local_corplms\external\<имя>` в `classes/external/<имя>.php`, extends `\core_external\external_api`.
- Методы: `execute_parameters()`, `execute()`, `execute_returns()`.
- Объявить в `db/services.php`; имя WS-функции — `local_corplms_<имя>`.
- В `execute()`: `validate_parameters()` → установить контекст (`context_*::instance()`) → `validate_context()` → `require_capability()` → бизнес-логика.
- Типы валидируются автоматически (`external_value`, `external_single_structure`, `external_multiple_structure`, PARAM_*).

## Правило журнала
**Каждую сессию обновлять `docs/PROGRESS.md`**: что сделано и проверено, принятые решения, открытые вопросы, следующие шаги. Цель — продолжить в новом контекстном окне без потери контекста.

## Технические правила окружения (повторяемые грабли)
- Docker-команды: префикс `sg docker -c '...'` (пользователь в группе docker, но не активно в shell Claude).
- Порты Docker Desktop публикуются на **Windows-хост**, не в WSL-loopback → открывать в браузере Windows (`:8080` Moodle, `:3000` фронт). Фронт ходит в Moodle по внутренней сети `http://app`.
- Moodle редиректит при `Host` != wwwroot → WS-клиент шлёт `Host: localhost:8080` (через `node:http`, не `fetch`).
- WS включается `scripts/ws_bootstrap.php` (enable + capability `webservice/rest:use` роли `user` + `external_services.enabled=1` для mobile). Админам токены WS запрещены — использовать обычного пользователя.
- Node живёт в nvm: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`.
- Сидеры контента идемпотентны: `seed_content.php`, `seed_quiz.php`, `seed_cert.php`, `enrol_demo.php`.

## Архитектурные решения (зафиксированы)
- **Не пишем LMS с нуля.** База — Moodle 4.5 (дистрибутив в этом репо).
- **Бэк-офис (создание курсов/тестов/банка вопросов, админка, управление ролями) = Moodle-админка.** Не переписываем.
- **Новый дизайн (Next.js) = опыт УЧЕНИКА**, headless через mobile-WS. Требование заказчика: **ничего не переходит в Moodle** для ролей нового UI.
- Дизайн-система: «Trust & Authority» (UX/UI Pro), индиго `#4F46E5`, success `#22C55E`, шрифты **Manrope + Source Sans 3** (кириллица; Lexend из скилла отклонён — нет кириллицы).
- Для on-prem без интернета (ТЗ п.12): самохостить шрифты, не тянуть с Google. TODO.

## ADR-001: Стек нового UI = TypeScript + Next.js/React (не PHP/Django)
**Решение:** headless-фронт ученика пишем на **TypeScript + Next.js (React)**.
**Почему:** (1) офиц. мобильное приложение Moodle само на JS/TS поверх тех же WS — родная пара;
(2) современный интерактив (видео, плеер тестов, PWA/офлайн) — сильная сторона JS;
(3) Next.js = готовый BFF (прячет токен, проксирует pluginfile, SSR); (4) TS даёт типобезопасность
над WS-payload; (5) один лишний язык, не два.
**Отклонено:** PHP-фреймворк поверх Moodle (дублирование — Moodle уже PHP; для живого UI всё равно
нужен JS); Django (третий язык, без выгоды).
**Исключение:** если ops заказчика строго PHP и запрещает Node-рантайм → Laravel + Inertia + Vue.
Спросить ИТ заказчика: «допустим ли Node-контейнер рядом с PHP на on-prem?».
**Разделение:** PHP — где данные (Moodle + `local_corplms` external functions); TS — представление.
