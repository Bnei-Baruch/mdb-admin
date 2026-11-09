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

### 1. Подключение Tailwind
- После перехода на Vite (этап 2 общей задачи) ставим **Tailwind v4** через `@tailwindcss/vite`. Тема задаётся в CSS (`@theme`), `tailwind.config.js` не нужен.
- Если эту задачу нужно начать до Vite: в CRA 5 работает только Tailwind v3 через PostCSS. Это временный вариант, потом придётся мигрировать на v4.
- Добавить `@tailwindcss/forms` для нормальных стилей инпутов.

### 2. Сосуществование на время миграции
Semantic CSS и Tailwind preflight конфликтуют (reset, `box-sizing`, шрифты, заголовки).
- На время миграции: **не подключать preflight**. В v4 импортировать `tailwindcss/theme` и `tailwindcss/utilities` без `preflight`, либо использовать префикс `@import "tailwindcss" prefix(tw)`.
- После удаления `semantic.min.css` — включить preflight обратно и убрать префикс (если был).

### 3. Слой своих UI-компонентов
Создать `src/components/ui/` — тонкие обёртки на Tailwind + Headless UI:
`Button`, `Input`, `Textarea`, `Field`, `Select/Listbox`, `Combobox`, `Checkbox`, `Switch`, `Modal`, `Alert`, `Badge`, `Card`, `Table`, `Tabs`, `Menu`, `Breadcrumb`, `Spinner`, `Flag`, `Icon`.

- API близкий к Semantic там, где это удешевляет миграцию (`loading`, `disabled`, `color`/`variant`, `onChange(e, { value })` для Dropdown-замен), чтобы не переписывать логику в контейнерах.
- Не переносить лишнее: если пропс Semantic не используется — не реализовывать.

### 4. Зависимости
- Добавить: `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/forms`, `@headlessui/react`, `@heroicons/react`, `flag-icons`.
- Удалить в конце: `semantic-ui-react`, `semantic-ui-css`.
- `react-day-picker` v7 → v9+ и `moment` → `date-fns`: этап 4 общей задачи. Компоненты дат удобно переделать заодно.

## План работ (по этапам, каждый — отдельный PR)

1. **Инфраструктура** — Tailwind + конфиг, preflight off, базовая тема (цвета, шрифт). Приложение выглядит как раньше.
2. **UI-кит** — `src/components/ui/*` с базовыми компонентами.
3. **Каркас приложения** — `App`, `FrontPage`, основное меню/навигация, `shared/*` (`Pagination`, `SearchHeader`, `ResultsPageHeader`, `TabsMenu`, `Splash`, `LanguageSelector`, `ErrWip`).
4. **Поля и формы** — `shared/Fields/*`, `shared/Forms/*` (Collection, ContentUnit, Persons, Publishers).
5. **Фильтры и автокомплит** — `Filters/*`, `Autocomplete/*` (Combobox с async-поиском).
6. **Списки (MainPage)** — `Collections`, `ContentUnits`, `Files`, `Operations`, `Persons`, `Publishers`, `Labels`, `Sources`, `Tags`.
7. **Страницы сущностей и вкладки** — `Collection`, `ContentUnit`, `File`, `Operation`, `Person`, `Publisher`, `Label`, `Source`, `Tag` (details, associations, files hierarchy, danger zone и т.д.).
8. **Очистка** — удалить `semantic-ui-*`, включить preflight, вычистить неиспользуемые css/scss (`Kmedia.scss`, `_colors-helpers.scss` и т.п.), обновить README.

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
