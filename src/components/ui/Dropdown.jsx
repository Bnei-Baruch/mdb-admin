import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu as HMenu,
  MenuButton as HMenuButton,
  MenuItem as HMenuItem,
  MenuItems as HMenuItems,
  MenuSeparator as HMenuSeparator,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';

import { buttonClasses, ButtonGroupContext } from './Button';
import { Flag } from './misc';

// Semantic-compatible Dropdown on top of Headless UI.
//  - options + search          -> Combobox (single or multiple)
//  - options                   -> Listbox
//  - children (Dropdown.Menu)  -> Menu
// Trigger look: `selection`/`search` -> input box, `button` -> button, otherwise inline (`item`).

const PANEL = 'z-50 max-h-72 min-w-[var(--button-width)] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none [--anchor-gap:4px] empty:invisible';
const OPTION = 'group relative flex cursor-pointer select-none items-center gap-2 py-2 pr-8 pl-3 text-gray-900 data-focus:bg-blue-600 data-focus:text-white data-disabled:cursor-not-allowed data-disabled:opacity-50';
const SELECTION_BOX = 'relative flex min-h-9 w-full cursor-default items-center gap-1 rounded-md bg-white py-1.5 pr-8 pl-3 text-left text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 data-open:ring-2 data-open:ring-blue-600';

// Headless UI gives us values, not events; call sites expect Semantic's (e, data) signature.
const fakeEvent = (name, value) => ({ preventDefault() {}, stopPropagation() {}, persist() {}, target: { name, value } });

const optionLabel = o => (
  <>
    {o.flag && <Flag name={o.flag} />}
    {o.content ?? o.text}
  </>
);

const useMaybeControlled = (value, defaultValue, multiple) => {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue ?? (multiple ? [] : null));
  return [isControlled ? value : inner, v => { if (!isControlled) setInner(v); }];
};

const Dropdown = props => {
  const {
    options, value, defaultValue, onChange, multiple, search, selection, button, item, fluid, upward, compact,
    text, placeholder, icon, disabled, loading, error, name, id, className, children, noResultsMessage = 'No results found.',
    selectOnBlur, scrolling, floating, labeled, inline, basic, clearable, // eslint-disable-line no-unused-vars
    ...rest
  } = props;

  const group = React.useContext(ButtonGroupContext);
  const anchor = upward ? 'top start' : 'bottom start';
  const [current, setCurrent] = useMaybeControlled(value, defaultValue, multiple);

  const emit = v => {
    setCurrent(v);
    if (onChange) {
      onChange(fakeEvent(name, v), { ...props, value: v });
    }
  };

  /* ----------------------------- action menu mode ---------------------------- */
  if (!options) {
    return (
      <HMenu as="div" className={cx('relative inline-block text-left', fluid && 'w-full', className)} {...rest}>
        <HMenuButton
          disabled={disabled}
          className={button
            ? buttonClasses({ color: group?.color, size: group?.size, className: 'gap-1' })
            : 'inline-flex h-full items-center gap-1 px-1 text-sm font-medium text-gray-700 hover:text-gray-900'}
        >
          {text}
          {icon === undefined ? <ChevronDownIcon aria-hidden className="size-4 opacity-70" /> : icon}
        </HMenuButton>
        <DropdownContext.Provider value={{ anchor: upward ? 'top end' : 'bottom end' }}>
          {children}
        </DropdownContext.Provider>
      </HMenu>
    );
  }

  const selectedOption = multiple ? null : options.find(o => o.value === current);
  const triggerText    = text ?? (selectedOption ? optionLabel(selectedOption) : null);

  /* ----------------------------- searchable select --------------------------- */
  if (search) {
    return (
      <SearchableSelect
        {...{ options, current, emit, multiple, fluid, upward, placeholder, disabled, loading, error, name, id, className, noResultsMessage, rest }}
      />
    );
  }

  /* -------------------------------- plain select ----------------------------- */
  const selectionLook = selection || (!button && !item);
  const triggerClass  = button
    ? buttonClasses({ color: group?.color, basic: group?.basic, size: group?.size, compact, className: cx('gap-1', group && 'rounded-none first:rounded-l-md last:rounded-r-md') })
    : (item && !selection)
      ? 'inline-flex w-full items-center justify-between gap-1 px-1 py-1 text-sm text-gray-800 hover:text-gray-900 focus:outline-none'
      : cx(SELECTION_BOX, error && 'ring-red-500');

  return (
    <Listbox value={current} onChange={emit} multiple={multiple} disabled={disabled} name={name}>
      <div className={cx('relative', (fluid || (selectionLook && !button)) ? 'w-full' : 'inline-block', className)} {...rest}>
        <ListboxButton id={id} className={triggerClass}>
          {icon && React.isValidElement(icon) ? icon : null}
          <span className={cx('truncate', !triggerText && 'text-gray-400')}>
            {multiple
              ? (current || []).map(v => options.find(o => o.value === v)?.text).filter(Boolean).join(', ') || placeholder
              : (triggerText ?? placeholder ?? ' ')}
          </span>
          {!button && !item && <ChevronDownIcon aria-hidden className="pointer-events-none absolute right-2 size-4 text-gray-400" />}
          {(button || item) && !React.isValidElement(icon) && <ChevronDownIcon aria-hidden className="size-4 opacity-70" />}
        </ListboxButton>
        <ListboxOptions anchor={anchor} transition className={cx(PANEL, 'transition duration-100 ease-in data-leave:data-closed:opacity-0')}>
          {options.map(o => (
            <ListboxOption key={o.key ?? o.value} value={o.value} disabled={o.disabled} className={OPTION}>
              {optionLabel(o)}
              <CheckIcon aria-hidden className="invisible absolute right-2 size-4 group-data-selected:visible" />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

Dropdown.propTypes = {
  options         : PropTypes.arrayOf(PropTypes.shape({
    key     : PropTypes.any,
    value   : PropTypes.any,
    text    : PropTypes.node,
    content : PropTypes.node,
    flag    : PropTypes.string,
    disabled: PropTypes.bool,
  })),
  value           : PropTypes.any,
  defaultValue    : PropTypes.any,
  onChange        : PropTypes.func,
  multiple        : PropTypes.bool,
  search          : PropTypes.bool,
  selection       : PropTypes.bool,
  button          : PropTypes.bool,
  item            : PropTypes.bool,
  fluid           : PropTypes.bool,
  upward          : PropTypes.bool,
  compact         : PropTypes.bool,
  text            : PropTypes.node,
  placeholder     : PropTypes.string,
  icon            : PropTypes.node,
  disabled        : PropTypes.bool,
  loading         : PropTypes.bool,
  error           : PropTypes.bool,
  name            : PropTypes.string,
  id              : PropTypes.string,
  className       : PropTypes.string,
  children        : PropTypes.node,
  noResultsMessage: PropTypes.node,
};

/* ------------------------------------------------------------------------------ */

const SearchableSelect = ({
  options, current, emit, multiple, fluid, upward, placeholder, disabled, loading, error, name, id, className, noResultsMessage, rest,
}) => {
  const [query, setQuery] = React.useState('');
  const q        = query.trim().toLowerCase();
  const filtered = q === '' ? options : options.filter(o => String(o.text ?? '').toLowerCase().includes(q));
  const byValue  = v => options.find(o => o.value === v);

  return (
    <Combobox
      value={current}
      onChange={v => {
        emit(multiple ? v : (v ?? null));
        setQuery('');
      }}
      onClose={() => setQuery('')}
      multiple={multiple}
      disabled={disabled}
      name={name}
      immediate
    >
      <div className={cx('relative', fluid !== false && 'w-full', className)} {...rest}>
        <div className={cx(SELECTION_BOX, 'flex-wrap focus-within:ring-2 focus-within:ring-blue-600', error && 'ring-red-500')}>
          {multiple && (current || []).map(v => (
            <span key={v} className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
              {byValue(v)?.text ?? v}
              <button
                type="button"
                aria-label="Remove"
                className="text-gray-400 hover:text-gray-700"
                onClick={() => emit(current.filter(x => x !== v))}
              >
                <XMarkIcon className="size-3" />
              </button>
            </span>
          ))}
          <ComboboxInput
            id={id}
            className="min-w-16 flex-1 border-0 bg-transparent p-0 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            displayValue={multiple ? () => query : v => (query || byValue(v)?.text) ?? ''}
            onChange={e => setQuery(e.target.value)}
            placeholder={multiple && (current || []).length ? '' : placeholder}
            autoComplete="off"
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon aria-hidden className={cx('size-4 text-gray-400', loading && 'animate-pulse')} />
          </ComboboxButton>
        </div>
        <ComboboxOptions anchor={upward ? 'top start' : 'bottom start'} className={cx(PANEL, 'w-[var(--input-width)]')}>
          {filtered.length === 0 && <div className="px-3 py-2 text-gray-500">{noResultsMessage}</div>}
          {filtered.map(o => (
            <ComboboxOption key={o.key ?? o.value} value={o.value} disabled={o.disabled} className={OPTION}>
              {optionLabel(o)}
              <CheckIcon aria-hidden className="invisible absolute right-2 size-4 group-data-selected:visible" />
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

SearchableSelect.propTypes = {
  options         : PropTypes.array.isRequired,
  current         : PropTypes.any,
  emit            : PropTypes.func.isRequired,
  multiple        : PropTypes.bool,
  fluid           : PropTypes.bool,
  upward          : PropTypes.bool,
  placeholder     : PropTypes.string,
  disabled        : PropTypes.bool,
  loading         : PropTypes.bool,
  error           : PropTypes.bool,
  name            : PropTypes.string,
  id              : PropTypes.string,
  className       : PropTypes.string,
  noResultsMessage: PropTypes.node,
  rest            : PropTypes.object,
};

/* --------------------------- action menu sub-components ------------------------- */

const DropdownContext = React.createContext({ anchor: 'bottom end' });

const DropdownMenu = ({ className, children }) => {
  const { anchor } = React.useContext(DropdownContext);
  return (
    <HMenuItems anchor={anchor} className={cx(PANEL, 'min-w-44', className)}>
      {children}
    </HMenuItems>
  );
};

DropdownMenu.propTypes = { className: PropTypes.string, children: PropTypes.node };

const DropdownItem = ({ as: As = 'button', onClick, text, content, children, className, disabled, ...rest }) => (
  <HMenuItem disabled={disabled}>
    <As
      type={As === 'button' ? 'button' : undefined}
      onClick={onClick ? e => onClick(e, { ...rest, text, content }) : undefined}
      className={cx('block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900', className)}
      {...rest}
    >
      {children ?? content ?? text}
    </As>
  </HMenuItem>
);

DropdownItem.propTypes = {
  as       : PropTypes.elementType,
  onClick  : PropTypes.func,
  text     : PropTypes.node,
  content  : PropTypes.node,
  children : PropTypes.node,
  className: PropTypes.string,
  disabled : PropTypes.bool,
};

const DropdownDivider = () => <HMenuSeparator className="my-1 h-px bg-gray-100" />;

Dropdown.Menu    = DropdownMenu;
Dropdown.Item    = DropdownItem;
Dropdown.Divider = DropdownDivider;

export default Dropdown;
