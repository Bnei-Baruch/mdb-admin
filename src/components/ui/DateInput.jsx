import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/20/solid';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import { formatLocalDate, parseLocalDate } from '../../helpers/date';
import { FieldContext, inputClasses } from './Form';

// Replacement for react-day-picker v7's DayPickerInput.
// Value in/out is a 'yyyy-MM-dd' string (or null when cleared).

export const DAY_PICKER_STYLE = { '--rdp-accent-color': 'var(--color-blue-600)', '--rdp-accent-background-color': 'var(--color-blue-50)' };

const DateInput = ({
  id, value, onChange, placeholder = 'YYYY-MM-DD', disabled, error, className, weekStartsOn = 0,
}) => {
  const field             = React.useContext(FieldContext);
  const [text, setText]   = React.useState(value || '');
  const selected          = parseLocalDate(value);
  const [month, setMonth] = React.useState(selected || new Date());

  React.useEffect(() => {
    setText(value || '');
    if (value) {
      const d = parseLocalDate(value);
      if (d) {
        setMonth(d);
      }
    }
  }, [value]);

  const emit = v => {
    if (v !== (value || null)) {
      onChange(v);
    }
  };

  const handleTextChange = e => {
    const next = e.target.value;
    setText(next);
    if (next.trim() === '') {
      emit(null);
      return;
    }

    const d = parseLocalDate(next);
    if (d) {
      setMonth(d);
      emit(formatLocalDate(d));
    }
  };

  // Drop a half-typed invalid value when leaving the field.
  const handleBlur = () => {
    if (text.trim() !== '' && !parseLocalDate(text)) {
      setText(value || '');
    }
  };

  return (
    <Popover className={cx('relative w-full', className)}>
      <div className="relative">
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={text}
          placeholder={placeholder}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className={cx(inputClasses(error ?? field.error), 'pr-9')}
        />
        <PopoverButton
          aria-label="Open calendar"
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <CalendarIcon className="size-4" />
        </PopoverButton>
      </div>
      <PopoverPanel
        anchor="bottom start"
        className="z-50 rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 [--anchor-gap:4px]"
      >
        {({ close }) => (
          <DayPicker
            mode="single"
            style={DAY_PICKER_STYLE}
            selected={selected || undefined}
            month={month}
            onMonthChange={setMonth}
            disabled={disabled}
            weekStartsOn={weekStartsOn}
            onSelect={d => {
              if (d) {
                setText(formatLocalDate(d));
                emit(formatLocalDate(d));
                close();
              }
            }}
          />
        )}
      </PopoverPanel>
    </Popover>
  );
};

DateInput.propTypes = {
  id          : PropTypes.string,
  value       : PropTypes.string,
  onChange    : PropTypes.func.isRequired,
  placeholder : PropTypes.string,
  disabled    : PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func, PropTypes.bool]),
  error       : PropTypes.bool,
  className   : PropTypes.string,
  weekStartsOn: PropTypes.number,
};

export default DateInput;
