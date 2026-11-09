import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Checkbox as HCheckbox, Field as HField, Label as HLabel, Switch } from '@headlessui/react';
import { CheckIcon, MinusIcon } from '@heroicons/react/16/solid';

import Dropdown from './Dropdown';
import Icon from './Icon';

// Semantic-compatible form controls: Form, Form.Field, Form.Group, Form.Input,
// Form.Dropdown, Form.Select, Form.TextArea, Form.Checkbox, Input, TextArea, Checkbox.

const FieldContext = React.createContext({ error: false });

// Field widths apply from md up; on small screens fields stack full-width (Semantic's stackable behaviour).
const WIDTH = {
  1 : 'w-full md:w-1/16',
  2 : 'w-full md:w-2/16',
  3 : 'w-full md:w-3/16',
  4 : 'w-full md:w-4/16',
  5 : 'w-full md:w-5/16',
  6 : 'w-full md:w-6/16',
  7 : 'w-full md:w-7/16',
  8 : 'w-full md:w-8/16',
  9 : 'w-full md:w-9/16',
  10: 'w-full md:w-10/16',
  11: 'w-full md:w-11/16',
  12: 'w-full md:w-12/16',
  13: 'w-full md:w-13/16',
  14: 'w-full md:w-14/16',
  15: 'w-full md:w-15/16',
  16: 'w-full',
};

const CONTROL = 'form-input block w-full rounded-md border-0 bg-white py-1.5 px-3 text-sm text-gray-900 shadow-xs ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500';
const controlRing = error => (error ? 'ring-red-400 focus:ring-red-600' : 'ring-gray-300 focus:ring-blue-600');

/** Classes for a raw <input> rendered by 3rd-party components (used by ui/DateInput). */
export const inputClasses = (error = false) => cx(CONTROL, controlRing(error));

/* ---------------------------------- Input ----------------------------------- */

export const Input = React.forwardRef(({
  value, defaultValue, onChange, icon, loading, fluid, transparent, error, size, label, action, // eslint-disable-line no-unused-vars
  className, style, type = 'text', children, ...rest
}, ref) => {
  const field    = React.useContext(FieldContext);
  const hasError = error ?? field.error;
  const iconName = loading ? 'spinner' : icon;

  return (
    <div className={cx('relative', fluid ? 'w-full' : 'inline-block', className)} style={style}>
      <input
        ref={ref}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={e => onChange && onChange(e, { ...rest, value: e.target.value })}
        className={cx(
          transparent ? 'block w-full border-0 bg-transparent p-0 text-sm focus:ring-0' : cx(CONTROL, controlRing(hasError)),
          iconName && 'pr-9'
        )}
        {...rest}
      />
      {iconName && typeof iconName === 'string' && (
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <Icon name={iconName} />
        </span>
      )}
      {children}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  value       : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange    : PropTypes.func,
  icon        : PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  loading     : PropTypes.bool,
  fluid       : PropTypes.bool,
  transparent : PropTypes.bool,
  error       : PropTypes.bool,
  size        : PropTypes.string,
  label       : PropTypes.node,
  action      : PropTypes.node,
  className   : PropTypes.string,
  style       : PropTypes.object,
  type        : PropTypes.string,
  children    : PropTypes.node,
};

/* --------------------------------- TextArea --------------------------------- */

export const TextArea = React.forwardRef(({ onChange, error, className, rows = 3, ...rest }, ref) => {
  const field = React.useContext(FieldContext);
  return (
    <textarea
      ref={ref}
      rows={rows}
      onChange={e => onChange && onChange(e, { ...rest, value: e.target.value })}
      className={cx(CONTROL.replace('form-input', 'form-textarea'), controlRing(error ?? field.error), className)}
      {...rest}
    />
  );
});

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  onChange : PropTypes.func,
  error    : PropTypes.bool,
  className: PropTypes.string,
  rows     : PropTypes.number,
};

/* --------------------------------- Checkbox --------------------------------- */

export const Checkbox = ({
  checked, defaultChecked, onChange, label, toggle, slider, disabled, indeterminate, id, name, value, className, type, // eslint-disable-line no-unused-vars
  readOnly,
}) => {
  const isControlled      = checked !== undefined;
  const [inner, setInner] = React.useState(!!defaultChecked);
  const current           = isControlled ? !!checked : inner;

  const handle = next => {
    if (readOnly) {
      return;
    }
    if (!isControlled) {
      setInner(next);
    }
    if (onChange) {
      onChange({ preventDefault() {}, stopPropagation() {}, target: { checked: next, name, value } }, { checked: next, name, value, id, label });
    }
  };

  const control = (toggle || slider)
    ? (
      <Switch
        id={id}
        checked={current}
        onChange={handle}
        disabled={disabled}
        name={name}
        className="group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 data-checked:bg-blue-600 data-disabled:cursor-not-allowed data-disabled:opacity-50"
      >
        <span aria-hidden className="pointer-events-none mt-0.5 ml-0.5 inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-4" />
      </Switch>
    )
    : (
      <HCheckbox
        id={id}
        checked={current}
        indeterminate={indeterminate}
        onChange={handle}
        disabled={disabled}
        name={name}
        value={value}
        className="group flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 data-checked:border-blue-600 data-checked:bg-blue-600 data-indeterminate:border-blue-600 data-indeterminate:bg-blue-600 data-disabled:cursor-not-allowed data-disabled:opacity-50"
      >
        <CheckIcon className="hidden size-3.5 text-white group-data-checked:block group-data-indeterminate:hidden" />
        <MinusIcon className="hidden size-3.5 text-white group-data-indeterminate:block" />
      </HCheckbox>
    );

  if (!label) {
    return <span className={cx('inline-flex align-middle', className)}>{control}</span>;
  }

  return (
    <HField className={cx('inline-flex items-center gap-2', className)} disabled={disabled}>
      {control}
      <HLabel className="cursor-pointer text-sm text-gray-800 select-none">{label}</HLabel>
    </HField>
  );
};

Checkbox.propTypes = {
  checked       : PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange      : PropTypes.func,
  label         : PropTypes.node,
  toggle        : PropTypes.bool,
  slider        : PropTypes.bool,
  disabled      : PropTypes.bool,
  indeterminate : PropTypes.bool,
  id            : PropTypes.string,
  name          : PropTypes.string,
  value         : PropTypes.any,
  className     : PropTypes.string,
  type          : PropTypes.string,
  readOnly      : PropTypes.bool,
};

/* ----------------------------------- Form ----------------------------------- */

const Form = ({ onSubmit, action, loading, error, success, warning, size, className, children, ...rest }) => ( // eslint-disable-line no-unused-vars
  <form
    noValidate
    action={action}
    onSubmit={e => {
      // Semantic's Form prevents the native submit unless an `action` is given.
      if (!action) {
        e.preventDefault();
      }
      if (onSubmit) {
        onSubmit(e, rest);
      }
    }}
    className={cx('flex flex-col gap-4', loading && 'pointer-events-none opacity-60', className)}
    {...rest}
  >
    {children}
  </form>
);

Form.propTypes = {
  onSubmit : PropTypes.func,
  action   : PropTypes.string,
  loading  : PropTypes.bool,
  error    : PropTypes.bool,
  success  : PropTypes.bool,
  warning  : PropTypes.bool,
  size     : PropTypes.string,
  className: PropTypes.string,
  children : PropTypes.node,
};

const FormField = ({
  label, error, required, width, inline, disabled, control: Control, className, children, id, ...rest
}) => {
  const hasError = !!error;
  const errorText = typeof error === 'string' || React.isValidElement(error) ? error : (error && error.content);

  return (
    <FieldContext.Provider value={{ error: hasError }}>
      <div
        className={cx(
          inline ? 'flex items-center gap-3' : 'flex flex-col gap-1',
          'min-w-0',
          '[&>label]:flex [&>label]:items-center [&>label]:text-sm [&>label]:font-medium [&>label]:text-gray-800',
          hasError && '[&>label]:text-red-700',
          required && "[&>label]:after:ml-0.5 [&>label]:after:text-red-600 [&>label]:after:content-['*']",
          disabled && 'pointer-events-none opacity-50',
          WIDTH[width],
          className
        )}
      >
        {label !== undefined && label !== null && <label htmlFor={id}>{label}</label>}
        {Control ? <Control id={id} error={hasError} disabled={disabled} {...rest} /> : children}
        {errorText && <p className="text-xs text-red-600">{errorText}</p>}
      </div>
    </FieldContext.Provider>
  );
};

FormField.propTypes = {
  label    : PropTypes.node,
  error    : PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object]),
  required : PropTypes.bool,
  width    : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inline   : PropTypes.bool,
  disabled : PropTypes.bool,
  control  : PropTypes.elementType,
  className: PropTypes.string,
  children : PropTypes.node,
  id       : PropTypes.string,
};

const FormGroup = ({ widths, inline, grouped, unstackable, className, children }) => ( // eslint-disable-line no-unused-vars
  <div
    className={cx(
      'flex flex-col gap-4 md:flex-row',
      inline ? 'md:items-center' : 'md:items-start',
      widths === 'equal' && 'md:[&>*]:flex-1',
      className
    )}
  >
    {children}
  </div>
);

FormGroup.propTypes = {
  widths     : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inline     : PropTypes.bool,
  grouped    : PropTypes.bool,
  unstackable: PropTypes.bool,
  className  : PropTypes.string,
  children   : PropTypes.node,
};

// Shorthands: <Form.Input label=... />, <Form.Dropdown label=... />, ...
const withField = (Control, defaults = {}) => {
  const Shorthand = ({ label, error, required, width, inline, className, id, ...rest }) => (
    <FormField label={label} error={error} required={required} width={width} inline={inline} className={className} id={id}>
      <Control id={id} error={!!error} {...defaults} {...rest} />
    </FormField>
  );
  Shorthand.propTypes = {
    label    : PropTypes.node,
    error    : PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object]),
    required : PropTypes.bool,
    width    : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    inline   : PropTypes.bool,
    className: PropTypes.string,
    id       : PropTypes.string,
  };
  return Shorthand;
};

Form.Field    = FormField;
Form.Group    = FormGroup;
Form.Input    = withField(Input, { fluid: true });
Form.TextArea = withField(TextArea);
Form.Dropdown = withField(Dropdown, { fluid: true });
Form.Select   = withField(Dropdown, { selection: true, fluid: true });
Form.Checkbox = ({ label, ...rest }) => <FormField><Checkbox label={label} {...rest} /></FormField>; // eslint-disable-line react/prop-types

export { FieldContext };
export default Form;
