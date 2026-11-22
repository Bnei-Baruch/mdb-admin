import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import Icon from './Icon';

// Semantic-compatible Search (autocomplete) with a fully controlled query.
// A custom component rather than Headless UI's Combobox, because every call site
// owns the query text (`value` + `onSearchChange`) and resets it after selection,
// which Combobox's internal input state does not support well.
//
// results: flat  -> [{ key, title, ... }]
//          category -> [{ name, results: [...] }]  (or an object of such categories)

const flatten = (results, category) => {
  if (!category) {
    return { groups: [{ name: null, results: results || [] }] };
  }

  const groups = Array.isArray(results) ? results : Object.values(results || {});
  return { groups };
};

const Search = ({
  value: valueProp,
  results,
  category,
  onSearchChange,
  onResultSelect,
  resultRenderer,
  noResultsMessage = 'No results found.',
  placeholder,
  loading,
  fluid,
  aligned,
  id,
  className,
  minCharacters = 1,
  showNoResults = true,
  disabled,
}) => {
  const [open, setOpen]     = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef             = React.useRef(null);
  const listId              = React.useId();

  // Like Semantic: `value={undefined}` means "uncontrolled" — keep the typed text internally.
  const [innerValue, setInnerValue] = React.useState(valueProp ?? '');
  const value = valueProp !== undefined && valueProp !== null ? valueProp : innerValue;

  const { groups } = flatten(results, category);
  const flat       = groups.flatMap(g => g.results || []);

  React.useEffect(() => {
    setActive(0);
  }, [results]);

  React.useEffect(() => {
    const onDocClick = e => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const select = (e, result) => {
    if (!result) {
      return;
    }

    setOpen(false);
    if (onResultSelect) {
      onResultSelect(e, { result, results, value });
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive(i => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && flat[active]) {
        e.preventDefault();
        select(e, flat[active]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showPanel = open && value.length >= minCharacters && (flat.length > 0 || showNoResults);
  let index       = -1;

  return (
    <div ref={rootRef} className={cx('relative', fluid ? 'w-full' : 'inline-block w-72', className)}>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onChange={e => {
            setOpen(true);
            setInnerValue(e.target.value);
            if (onSearchChange) {
              onSearchChange(e, { value: e.target.value });
            }
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="form-input block w-full rounded-full border-0 py-1.5 pr-9 pl-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          {loading ? <Icon name="spinner" /> : <MagnifyingGlassIcon className="size-4" />}
        </span>
      </div>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className={cx(
            'absolute z-50 mt-1 max-h-96 w-full min-w-72 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5',
            aligned === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {flat.length === 0 && <div className="px-3 py-2 text-gray-500">{noResultsMessage}</div>}
          {groups.map((g, gi) => (
            (g.results || []).length > 0 && (
              <div key={g.name ?? gi} className={cx(category && gi > 0 && 'border-t border-gray-100')}>
                {category && g.name && (
                  <div className="bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">{g.name}</div>
                )}
                {g.results.map(r => {
                  index += 1;
                  const i = index;
                  return (
                    <div
                      key={r.key ?? r.id ?? i}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={e => e.preventDefault()}
                      onClick={e => select(e, r)}
                      className={cx('cursor-pointer px-3 py-2', i === active ? 'bg-blue-600 text-white' : 'text-gray-900')}
                    >
                      {resultRenderer ? resultRenderer(r) : (r.title ?? r.text)}
                    </div>
                  );
                })}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

Search.propTypes = {
  value           : PropTypes.string,
  results         : PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  category        : PropTypes.bool,
  onSearchChange  : PropTypes.func,
  onResultSelect  : PropTypes.func,
  resultRenderer  : PropTypes.func,
  noResultsMessage: PropTypes.node,
  placeholder     : PropTypes.string,
  loading         : PropTypes.bool,
  fluid           : PropTypes.bool,
  aligned         : PropTypes.string,
  id              : PropTypes.string,
  className       : PropTypes.string,
  minCharacters   : PropTypes.number,
  showNoResults   : PropTypes.bool,
  disabled        : PropTypes.bool,
};

export default Search;
