# Задача: апгрейд всех зависимостей mdb-admin

Общая задача. Подзадачи вынесены в отдельные файлы:
- [semantic-to-tailwind.md](./semantic-to-tailwind.md): миграция UI с Semantic UI на Tailwind

## Аудит (2026-11-09)

- `yarn audit`: **83 уязвимости** (7 critical, 29 high, 30 moderate, 17 low).
  - ~70 из них приходят из `react-scripts` (CRA): старые webpack, jest, svgo, postcss и т.д. Обновлением не лечится, нужна замена сборщика.
  - 6 из `babel-preset-env` (Babel 6, мёртвый пакет), 1 из `npm-run-all`.
  - `axios` (3 high), `qs`, `sass`, `eslint-plugin-react-hooks` лечатся обычным обновлением.
- Node в Dockerfile: `node:24`. Локально проверялось на Node 26.

### Цепочка блокировок

```
CRA (react-scripts) ──► Vite ──► Tailwind v4
semantic-ui-react (peer react ≤18) ──► Tailwind-миграция ──► React 19 ──► react-router 8
moment ──► date-fns ──► react-day-picker v9+
```

`semantic-ui-react@2.1.5` поддерживает только React 16–18 и не развивается с конца 2023. `react-router@8` требует `react >= 19.2.7`. Поэтому без ухода с Semantic нельзя обновить ни React, ни роутер.

## Классификация зависимостей

### 🔴 Мёртвое или неиспользуемое: удалить

| Пакет | Почему |
|---|---|
| `babel-preset-env` | Babel 6, давно заменён на `@babel/preset-env`. Нигде не используется, даёт 4 critical и 2 high уязвимости |
| `customize-cra` | Нет `config-overrides.js`, `react-app-rewired` не установлен, пакет нигде не подключён |
| `babel-plugin-lodash` | Нет `.babelrc`, CRA его не подхватывает |
| `@babel/cli` | Нигде не вызывается |
| `util` | 0 импортов в `src` |
| `date-fns` | Сейчас 0 использований. **Оставить**: будет заменой `moment` |
| `eslint-plugin-jsx-a11y` | Не подключён в `eslint.config.js`. Либо подключить, либо удалить |
| `src/vendors.js` | Нигде не импортируется, содержит `redux-oidc`, которого нет в зависимостях. Остаток старого webpack-конфига |
| `App.test.js`, `setupTests.js` | Используют `enzyme` / `jest-enzyme`, которых нет в зависимостях. Тесты не запускаются. Удалить или переписать на Testing Library / Vitest |

### 🟠 Требует замены

| Пакет | Использование | Замена |
|---|---|---|
| `react-scripts` 5.0.1 | Вся сборка | **Vite** + `@vitejs/plugin-react`. CRA официально deprecated (февраль 2025) и даёт ~70 уязвимостей |
| `npm-run-all` | Параллельные `watch-css` + `start-js` | Не нужен: Vite компилирует `.scss` при импорте |
| `semantic-ui-react`, `semantic-ui-css` | 127 файлов | Tailwind + Headless UI, см. [semantic-to-tailwind.md](./semantic-to-tailwind.md) |
| ~~`moment`~~ | ✅ заменён | `date-fns` + `@date-fns/utc` (этап 4) |
| ~~`react-day-picker` 7.4.10~~ | ✅ обновлён | v10, `DayPickerInput` заменён на `ui/DateInput` (этап 4) |
| ~~`react-router-dom`~~ | ✅ удалён | импорты переведены на `react-router` (этап 5) |
| `redux-actions` | 17 файлов (16 `handleActions`) | Опционально: Redux Toolkit (`createSlice`/`createAction`). Пакет живой, но не развивается. Низкий приоритет |
| `redux` `createStore` | `src/index.js` | Помечен deprecated. Опционально `configureStore` из RTK. Работает и так |

### 🟡 Мажорные апгрейды (после разблокировки)

| Пакет | Сейчас → последняя | Условие / заметки |
|---|---|---|
| ✅ `react`, `react-dom` | 18.3.1 → 19.3 | После удаления Semantic. 100 class-компонентов, но `findDOMNode`, string refs, legacy context и `componentWill*` не найдены. Нужно проверить `defaultProps` в function-компонентах (в 19 игнорируются). `propTypes` в 19 не проверяются; пакет `prop-types` (149 файлов) можно оставить или постепенно убрать |
| ✅ `react-router` | 7.18 → 8.5 | После React 19. Проверить совместимость `@lagunovsky/redux-react-router` (peer: `react-router ^6–8`, ок) |
| ✅ `eslint` | 9 → 10 | сделано (этап 6) |
| ✅ ~~`@babel/*`~~ | удалены | ESLint работает на стандартном парсере (этап 6) |
| ✅ `eslint-plugin-react-hooks` | — | перенесён в devDependencies (этап 1); `eslint-plugin-import` удалён (этап 6) |

### 🟢 Безопасные минорные/патч-обновления

`axios` 1.21.0, `qs` 6.17.1, `filesize` 11.0.30, `keycloak-js` 26.2.5, `react-redux` 9.3.1, `react-router-dom` 7.18.5, `sass` 1.108.1, `globals` 17.14.0, `@babel/core` / `@babel/eslint-parser` 7.29.13.

### ✅ Актуальные, оставить

`redux` 5, `redux-saga` 1.5, `reselect` 5, `react-redux` 9, `lodash`, `classnames`, `history` 5 (нужен `@lagunovsky/redux-react-router`), `react-fast-compare`, `keycloak-js` 26, `@lagunovsky/redux-react-router` 4.6.

## План (каждый этап = отдельный PR)

1. ✅ **Чистка и патчи** (сделано 2026-11-09)
   - Удалены `babel-preset-env`, `customize-cra`, `babel-plugin-lodash`, `@babel/cli`, `util`, `eslint-plugin-jsx-a11y`, а также файлы `src/vendors.js`, `App.test.js`, `setupTests.js`.
   - Применены 🟢 обновления, eslint-плагины перенесены в devDeps.
   - Обновлены вложенные `follow-redirects` → 1.16.3 и `source-map-js` → 1.2.2.
   - Итог: `yarn audit` 83 → **66** (critical 7 → 3, high 29 → 17). Всё оставшееся приходит из `react-scripts` и `npm-run-all` и уйдёт на этапе 2.
2. ✅ **CRA → Vite** (сделано 2026-11-09: Vite 8, 172 файла с JSX переименованы в `.jsx`, `cssMinify: 'esbuild'` временно, пока подключён Semantic; `yarn audit`: 66 → 0 от `react-scripts`/`npm-run-all`)
   - `vite.config.js`: `base` с учётом `/admin/`, `build.outDir: 'build'` (на это завязаны Dockerfile и deploy-скрипты), `envPrefix: 'REACT_APP_'`, чтобы не переименовывать env-переменные (Dockerfile, `.env.*`, CI).
   - `process.env.REACT_APP_*` → `import.meta.env.REACT_APP_*` (7 мест, в основном `src/helpers/env.js`).
   - `public/index.html` → `index.html` в корне.
   - Импортировать `.scss` напрямую и убрать `build-css` / `watch-css` / сгенерированные `.css`.
   - Обновить `scripts`, `Dockerfile`, `.github/workflows/cicd.yml`, README.
   - Удалить `react-scripts`, `npm-run-all`.
   - Тесты: Vitest + Testing Library (минимум smoke-тест) либо явно без тестов.
3. ✅ **Semantic → Tailwind** (сделано 2026-11-09, коммиты `2e1ba07`…): см. [semantic-to-tailwind.md](./semantic-to-tailwind.md). Удалены `semantic-ui-react`, `semantic-ui-css`, `sass`. ⚠️ Нужна ручная проверка по чеклисту. **React 19 разблокирован.**
4. ✅ **moment → date-fns + react-day-picker v10** (сделано 2026-11-09)
   - `src/helpers/date.js`: `formatUTC`, `toDateString`, `todayUTC`, `formatDuration`, `parseLocalDate`, `formatLocalDate`, `localDayAsUTC` (на `date-fns` + `@date-fns/utc`). Протестированы в TZ Asia/Jerusalem и America/New_York.
   - `ui/DateInput`: замена `DayPickerInput` (поле ввода + `DayPicker` в Headless UI `Popover`). `FilmDateField`/`DateRangeField` используют его.
   - `DateRangeFilter` переписан на `DayPicker mode="range"`; пресеты и сдвиг на UTC-офсет при Apply сохранены.
   - **Исправлено попутно:** даты в формах раньше хранились то как moment, то как `Date` (после выбора в календаре). `cleanProperties` форматировал только moment, `Date` уходил в API ISO-строкой со временем. Теперь в состоянии форм всегда строки `yyyy-MM-dd`.
   - Удалены `moment`, константа `DATE_FORMAT`, `collections.css` (стили `DayPickerInput`). JS-бандл ~1195 → ~1086 kB.
   - ⚠️ После смены зависимостей dev-сервер нужно запускать с `--force` (кэш предсобранных зависимостей Vite).
5. ✅ **React 19 + react-router 8** (сделано 2026-11-09)
   - `react`/`react-dom` 18.3 → 19.3. AST-скан: `defaultProps` у function-компонентов, string refs, legacy context, `findDOMNode`, `UNSAFE_*` не найдены. `static contextType` в `FilterTags` — современный API, работает.
   - Все зависимости с peer `react` поддерживают 19: Headless UI, react-redux 9, `@lagunovsky/redux-react-router`, react-day-picker 10, heroicons.
   - Импорты `react-router-dom` → `react-router` (36 файлов), пакет `react-router-dom` удалён (в v8 его больше нет).
   - `react-router` 7.18 → 8.5. Из breaking changes v8 нас касаются только удаление `react-router-dom` и Node ≥ 22.22 (Dockerfile: `node:24`). Остальное относится к data/framework mode, которые проект не использует.
   - Проверено: сборка, lint, страница логина без ошибок в консоли. Внутренние страницы — в общей ручной проверке.
6. ✅ **Линтинг-тулчейн** (сделано 2026-11-10)
   - ESLint 9.39 → 10.14. Babel убран полностью (`@babel/core`, `@babel/eslint-parser`, `@babel/preset-react`): стандартный парсер (espree, `ecmaVersion: 'latest'`) понимает JSX и class fields.
   - `eslint-plugin-import` удалён: ни одно его правило не было включено. `.eslintignore` перенесён в `ignores` конфига.
   - Включены `react/jsx-uses-vars` и `react/jsx-uses-react`, а у `no-unused-vars` — `ignoreRestSiblings`. Раньше ESLint считал каждый импортированный JSX-компонент неиспользуемым. Предупреждений: 1655 → 659, ошибок 0. Оставшиеся относятся к старому коду (форматирование `indent`/`arrow-parens`/`padding-line…`, 17 устаревших `eslint-disable`).
   - ⚠️ `eslint-plugin-react` 7.37.5 (последняя) официально поддерживает ESLint до `^9.7`: yarn предупреждает о peer, но на ESLint 10 плагин работает. Если сломается — замена на `@eslint-react/eslint-plugin` (`@eslint-react/jsx-uses-vars`).
   - ⚠️ `yarn audit`: 2 moderate в `minimatch` (через `eslint`). Исправлено только в `minimatch` 11, а ESLint 10 требует `^10`. Это dev-зависимость, паттерны задаём мы сами — риск минимальный. Ждём обновления ESLint.
   - `axios` 1.21.0 → 1.21.1.
7. *(Опционально)* Redux Toolkit вместо `redux-actions` + `createStore`.

## Критерии готовности

- `yarn audit`: 0 critical / high.
- Нет deprecated / мёртвых пакетов в `package.json`.
- React 19, react-router 8, Vite, Tailwind. Semantic, CRA и moment удалены.
- Docker-сборка и CI работают для всех окружений (production, staging, external, suitcase).
- Функциональный чеклист из [semantic-to-tailwind.md](./semantic-to-tailwind.md) пройден.
