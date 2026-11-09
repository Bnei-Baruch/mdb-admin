# Задача: миграция с Semantic UI на Tailwind CSS

> ✅ **Выполнено** (ветка `upgrade_deps`). Осталась ручная проверка по чеклисту ниже.
>
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
- `tailwind.css` импортируется в `App.jsx` **последним**, после `Kmedia.css` и `App.css`.

### 2. Сосуществование на время миграции ✅ (снято на подэтапе 8)
- Пока оба CSS были подключены, preflight был выключен, а utilities Tailwind подключались вне cascade layer, чтобы перекрывать Semantic. Для `semantic.min.css` использовался `cssMinify: 'esbuild'`.
- Сейчас `tailwind.css` — это обычный `@import "tailwindcss"` (с preflight) плюс небольшой `@layer base` для голых `a`, `h1`–`h4`, `p`, `pre`, `small`.
- Флаги: `flag-icons` (CSS-классы `fi fi-xx`). В `vite.config.mjs` для них отключён `assetsInlineLimit`, иначе ~500 SVG встраиваются в CSS.
- Шрифт: системный (Tailwind по умолчанию) вместо Lato, который подгружал Semantic.

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
| 4 | **Поля и формы**: `shared/Fields/*` (14), `shared/Forms/*` (12) | ✅ перенесено. ⚠️ вживую не проверено. В кит добавлены `inputClasses()` для `DayPickerInput` и неконтролируемый режим `Search` (`value={undefined}`, как в Semantic) |
| 5 | **Фильтры и автокомплит**: `Filters/*` (11), `Autocomplete/*` (2), `Operations/filters` | ✅ перенесено. ⚠️ вживую не проверено. В `Icon` добавлены `tag`, `calendar`, `book`, `protect` (иконки тегов фильтров); ширина `Form.Field width` теперь только с `md` |
| 6 | **Списки (MainPage)**: `BaseClasses` (4), `Collections`, `ContentUnits`, `Operations`, `Persons`, `Publishers`, `Labels` | ✅ перенесено (14 файлов, кит без доработок). ⚠️ вживую не проверено; `Sticky` теперь CSS-sticky — проверить закрепление пагинации |
| 7 | **Страницы сущностей**: `ContentUnit/tabs` (16), `Collection/tabs` (8), `File/tabs` (7), `Sources` (8), `Tags` (8), `Label`, `Person`, `Publisher` (по 4), `Operation` (3) | ✅ перенесено (62 файла). ⚠️ вживую не проверено. В `Icon` добавлены 11 иконок типов файлов (`fileIcon` из `helpers/utils.js`); в `DeepListFilter` меню без рамок через классы вместо `.filter-steps .ui.menu` |
| 8 | **Очистка**: удалены `semantic-ui-react`, `semantic-ui-css`, `sass`; включён preflight; `cssMinify` по умолчанию (Lightning CSS); `Kmedia.scss` + `_colors-helpers.scss` + `_text-helpers.scss` → один `Kmedia.css` без мёртвых блоков | ✅ CSS-бандл 588 kB → 86 kB |

Semantic UI полностью удалён из проекта.

### Попутно исправлено
- Коды флагов в `consts.js`: датский `da`→`dk`, эстонский `et`→`ee`, греческий `el`→`gr`, тагальский `tl`→`ph`. Раньше флаги не показывались или показывались чужие.

### Открытые вопросы / риски
- `ForbiddenPage` вызывает `userManager.signoutRedirect()` у объекта из `InitKeycloak`. Похоже на старый баг, не связанный с миграцией. Проверить.
- **Вживую после логина ничего не проверялось.** Проверены только сборка, lint, AST-анализ пропсов и страница логина. Нужно пройти чеклист функциональности ниже.
- JS-бандл вырос ~1075 → ~1195 kB (Headless UI). Code splitting — отдельная задача.

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
