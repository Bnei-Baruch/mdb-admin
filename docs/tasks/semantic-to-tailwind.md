# Задача: миграция с Semantic UI на Tailwind CSS

> Часть общей задачи [upgrade-dependencies.md](./upgrade-dependencies.md), этап 3. Делается **после** перехода CRA → Vite. Блокирует апгрейд на React 19: `semantic-ui-react` поддерживает только React ≤18.

## Цель

Убрать зависимость от `semantic-ui-react` и `semantic-ui-css`, перевести UI на Tailwind CSS.

**Принципы:**
- Точное копирование дизайна **не требуется** — допустим новый, более чистый вид.
- **Функциональность важнее внешнего вида**: все формы, фильтры, модалки, таблицы, поиск, навигация должны работать как раньше.
- Где нужно — использовать **готовые компоненты** (Headless UI, Tailwind UI / Tailwind Plus паттерны), а не писать сложное поведение (dropdown, modal, combobox) с нуля.

## Текущее состояние

- 239 JS-файлов в `src/`, из них **127** импортируют `semantic-ui-react`.
- Глобальный CSS: `import 'semantic-ui-css/semantic.min.css'` в `src/components/App/App.js`.
- Дополнительные стили: `src/stylesheets/*.scss` (компилируются через `sass src/:src/`), локальные `.css` (`App.css`, `files.css`, `collections.css`, `associations/style.css`).
- Сборка: CRA (`react-scripts` 5), без eject.
- `react-day-picker` v7 (`DateRangeFilter`, `DateRange`, `FilmDate`) со своим CSS.

### Использование компонентов Semantic (кол-во файлов)

| Компонент | Файлов | Замена |
|---|---|---|
| Header | 56 | `h1–h4` + utility-классы / `ui/Heading` |
| Segment | 55 | `div` + `rounded border bg-white p-4 shadow-sm` / `ui/Card` |
| Menu | 47 | nav / tabs — свой `ui/Menu`, `ui/Tabs` (Headless UI `Tab` где нужно) |
| Button | 46 | `ui/Button` (variants: primary, secondary, danger, basic; loading, disabled, icon) |
| Icon | 39 | `@heroicons/react` (или `lucide-react`) |
| Grid | 32 | CSS grid / flex utilities |
| Form | 31 | `form` + `ui/Field`, `ui/Input`, `ui/Textarea`, состояния error |
| List | 26 | `ul/li` + utilities |
| Message | 22 | `ui/Alert` (info, success, warning, error) |
| Input | 22 | `ui/Input` (с иконкой, loading, action-кнопкой) |
| Table | 19 | `ui/Table` (striped, sortable headers, selectable rows) |
| Divider | 18 | `hr` / `border-t` |
| Modal | 17 | Headless UI `Dialog` → `ui/Modal` |
| Flag | 16 | `flag-icons` (CSS) → `ui/Flag` |
| Dropdown | 12 | Headless UI `Listbox` / `Combobox` (search, multiple, selection) |
| Label | 7 | `ui/Badge` |
| Checkbox | 5 | `ui/Checkbox` / Headless UI `Switch` для toggle |
| Search | 4 | Headless UI `Combobox` с async-загрузкой (`Autocomplete/*`) |
| Image | 3 | `img` |
| Sticky | 2 | `sticky top-0` |
| Breadcrumb | 2 | `ui/Breadcrumb` |
| Container, Loader, Statistic | по 1 | utilities / `ui/Spinner` |

## Технический подход

### 1. Подключение Tailwind ✅
- **Tailwind v4** через `@tailwindcss/vite`, точка входа: `src/stylesheets/tailwind.css`. Тема задаётся в CSS (`@theme`), `tailwind.config.js` не нужен.
- `@tailwindcss/forms` подключён со `strategy: "class"`: стили применяются только через классы `form-input`/`form-textarea`, глобального ресета инпутов нет.
- `tailwind.css` импортируется в `App.jsx` **последним**, после `semantic.min.css`, `Kmedia.scss` и `App.css`.

### 2. Сосуществование на время миграции ✅
- **Preflight не подключён.** Импортируются только `theme.css` и `utilities.css`.
- Utilities подключены **вне cascade layer**. Иначе неслоёные правила Semantic (например `h1 { font-size }`) всегда побеждали бы утилиты Tailwind.
- Вместо preflight подключён минимальный `@layer base`: `border-style: solid; border-width: 0` через `:where(...)`, чтобы работали утилиты `border-*`. Нативные контролы, `table` и `hr` исключены.
- Флаги: `flag-icons` (CSS-классы `fi fi-xx`). В `vite.config.mjs` для них отключён `assetsInlineLimit`, иначе ~500 SVG встраиваются в CSS.
- `build.cssMinify: 'esbuild'`: Lightning CSS падает на невалидных селекторах в `semantic.min.css`.
- **После удаления Semantic:** заменить импорты в `tailwind.css` на `@import "tailwindcss";`, убрать migration base, вернуть `cssMinify` по умолчанию.

### 3. UI-кит `src/components/ui/` ✅
Tailwind + Headless UI + Heroicons. **API повторяет используемое подмножество пропсов Semantic.** Статистику собирали AST-скриптом по всем файлам. Поэтому перенос файла в основном сводится к замене импорта.

| Файл | Компоненты | Основа |
|---|---|---|
| `Button.jsx` | `Button`, `Button.Group` | color/primary/basic/size/floated/loading/icon/circular/compact; `inverted` игнорируется |
| `Dropdown.jsx` | `Dropdown` (+ `.Menu`, `.Item`, `.Divider`) | Headless `Listbox` (options), `Combobox` (search, multiple), `Menu` (children); режимы `selection`/`button`/`item`; `onChange(e, { ...props, value })` |
| `Form.jsx` | `Form`, `.Field`, `.Group`, `.Input`, `.Dropdown`, `.Select`, `.TextArea`, `.Checkbox`, `Input`, `TextArea`, `Checkbox` | `Form` делает `preventDefault` как Semantic; `Field error` подсвечивает вложенные контролы через context; `Checkbox` на Headless `Checkbox`/`Switch` (toggle) |
| `Grid.jsx` | `Grid`, `.Row`, `.Column` | 16-колоночная сетка на flex; `stackable`, `divided`, `reversed="computer"`, `columns` |
| `Header.jsx` | `Header`, `.Content`, `.Subheader` | size/color/icon/attached/inverted/floated/sub; `icon={true}`: иконка над текстом |
| `Icon.jsx` | `Icon`, `renderIcon` | маппинг используемых имён Semantic → Heroicons; `icon` может быть строкой, `{ name, ... }` или элементом |
| `List.jsx` | `List` (+ `.Item`, `.Content`, `.Header`, `.Description`, `.List`, `.Icon`) | divided/relaxed/horizontal; `Content floated` через float |
| `Menu.jsx` | `Menu`, `.Item`, `.Menu` | варианты: toolbar (attached borderless), nav (pointing, NavLink `.active`), tabs (secondary/tabular), vertical, pagination |
| `Modal.jsx` | `Modal`, `.Header`, `.Content`, `.Actions` | Headless `Dialog`; `closeIcon`, `closeOnDimmerClick`, `size` |
| `Search.jsx` | `Search` | **своя реализация**: запрос полностью контролирует родитель (`value` + `onSearchChange`), Headless `Combobox` так не умеет; категории, клавиатура |
| `Segment.jsx` | `Segment`, `.Group` | attached/basic/clearing/secondary/padded/color |
| `Table.jsx` | `Table` (+ `.Header`, `.Body`, `.Footer`, `.Row`, `.HeaderCell`, `.Cell`) | compact/basic/celled/selectable/striped; `collapsing`, `width`, `sorted` |
| `misc.jsx` | `Divider`, `Message`, `Label`, `Flag`, `Loader`, `Image`, `Container`, `Sticky`, `Statistic`, `Breadcrumb` | `Sticky` — CSS `position: sticky` вместо `context` |
| `colors.js` | карты цветов Semantic → Tailwind | классы выписаны полностью, чтобы их увидел сканер Tailwind |

### Как мигрировать файл
1. `from 'semantic-ui-react'` → `from '<относительный путь>/ui'`.
2. Проверить нестандартные пропсы. Если компонент кита чего-то не умеет, **доработать кит**, а не обходить его в файле.
3. Если в Dev-консоли пишет `ui/Icon: unknown icon "..."`, добавить иконку в `ICONS` в `Icon.jsx`.
4. Проверить экран вживую: dev-сервер запускать как `BROWSER=none yarn start`. Флаг `--open false` Vite понимает как путь `/admin/false`.

### 4. Зависимости ✅
- Добавлены: `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/forms`, `@headlessui/react`, `@heroicons/react`, `flag-icons`.
- Удалить в конце: `semantic-ui-react`, `semantic-ui-css`.
- `react-day-picker` v7 → v9+ и `moment` → `date-fns`: этап 4 общей задачи. Компоненты дат удобно переделать заодно.

## План работ и статус

| # | Подэтап | Статус |
|---|---|---|
| 1 | **Инфраструктура**: Tailwind, режим миграции, флаги | ✅ `2e1ba07` |
| 2 | **UI-кит** `src/components/ui/*` | ✅ `2e1ba07` |
| 3 | **Каркас**: `FrontPage/*` (AppLayout, Login, Forbidden, Welcome), `shared/*.jsx` (Pagination, TabsMenu, Splash, SearchHeader, ErrWip, Properties, LanguageSelector) | ✅ `2e1ba07`. ⚠️ после логина вживую не проверено |
| 4 | **Поля и формы**: `shared/Fields/*` (14), `shared/Forms/*` (12) | ⏳ в работе |
| 5 | **Фильтры и автокомплит**: `Filters/*` (11), `Autocomplete/*` (2), `Operations/filters` | ⬜ |
| 6 | **Списки (MainPage)**: `BaseClasses` (4), `Collections`, `ContentUnits`, `Operations`, `Persons`, `Publishers`, `Labels` | ⬜ |
| 7 | **Страницы сущностей**: `ContentUnit/tabs` (16), `Collection/tabs` (8), `File/tabs` (7), `Sources` (8), `Tags` (8), `Label`, `Person`, `Publisher` (по 4), `Operation` (3) | ⬜ |
| 8 | **Очистка**: удалить `semantic-ui-*`, включить preflight, вернуть `cssMinify`, вычистить старые css/scss (`Kmedia.scss`, `_colors-helpers.scss`, `App.css`, `files.css`, `collections.css`, `associations/style.css`), обновить README | ⬜ |

Осталось файлов с `semantic-ui-react`: **~115** (на момент `2e1ba07`).

### Попутно исправлено
- Коды флагов в `consts.js`: датский `da`→`dk`, эстонский `et`→`ee`, греческий `el`→`gr`, тагальский `tl`→`ph`. Раньше флаги не показывались или показывались чужие.

### Открытые вопросы / риски
- Внутренние страницы после логина Keycloak ещё не проверены вживую.
- `ForbiddenPage` вызывает `userManager.signoutRedirect()` у объекта из `InitKeycloak`. Похоже на старый баг, не связанный с миграцией. Проверить.
- `Kmedia.scss` и `App.css` могут содержать селекторы под разметку Semantic (`.ui ...`). Проверить на подэтапе 8.

## Чеклист функциональности (проверить после каждого этапа)

- [ ] Логин через Keycloak, splash/loader при старте
- [ ] Навигация между разделами, вкладки на страницах сущностей
- [ ] Списки: пагинация, сортировка, фильтры (даты, content type, operation type, secure, текст)
- [ ] Автокомплит Sources/Tags (поиск, выбор, иерархия)
- [ ] Создание/редактирование Collection, ContentUnit, Person, Publisher — валидация и сообщения об ошибках
- [ ] Модалки ассоциаций (CU ↔ Collection), выбор и сохранение
- [ ] Иерархия файлов (`FilesHierarchy`), иерархии Sources/Tags
- [ ] Danger Zone: подтверждения, dropdown'ы, удаление/изменение secure
- [ ] Выбор языка, флаги языков
- [ ] Выбор дат (`react-day-picker`)
- [ ] Состояния loading / error / empty везде, где были
- [ ] Клавиатура и фокус в модалках и dropdown'ах (даёт Headless UI)

## Критерии готовности

- В `src/` нет импортов `semantic-ui-react` и `semantic-ui-css`, пакеты удалены из `package.json`.
- Все пункты чеклиста работают.
- `yarn build` проходит, ESLint без новых ошибок.
- Нет визуально «сломанных» экранов (вёрстка аккуратная, не обязательно 1-в-1 со старой).

## Вне скоупа

- Переписывание redux/saga-логики, переход на функциональные компоненты/хуки (только если требуется для конкретного компонента).
- Редизайн UX-флоу — только визуальный слой.
