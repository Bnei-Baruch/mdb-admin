// Small presentational components: Divider, Message, Label, Flag, Loader,
// Image, Container, Sticky, Statistic, Breadcrumb.
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

import { SOFT } from './colors';
import Icon, { renderIcon } from './Icon';

/* ---------------------------------- Divider --------------------------------- */

export const Divider = ({ horizontal, hidden, section, fitted, vertical, className, children, content, ...rest }) => {
  const label   = children ?? content;
  const spacing = fitted ? 'my-0' : (section ? 'my-8' : 'my-4');

  if (vertical) {
    return <div className={cx('mx-3 self-stretch border-l border-gray-200', className)} {...rest}>{label}</div>;
  }

  if (horizontal && label) {
    return (
      <div className={cx('flex items-center gap-3 text-sm font-semibold uppercase text-gray-500', spacing, className)} {...rest}>
        <div className={cx('flex-1', !hidden && 'border-t border-gray-200')} />
        {label}
        <div className={cx('flex-1', !hidden && 'border-t border-gray-200')} />
      </div>
    );
  }

  return <div role="separator" className={cx(spacing, !hidden && 'border-t border-gray-200', 'clear-both', className)} {...rest} />;
};

Divider.propTypes = {
  horizontal: PropTypes.bool,
  hidden    : PropTypes.bool,
  section   : PropTypes.bool,
  fitted    : PropTypes.bool,
  vertical  : PropTypes.bool,
  className : PropTypes.string,
  children  : PropTypes.node,
  content   : PropTypes.node,
};

/* ---------------------------------- Message --------------------------------- */

const MESSAGE_VARIANTS = {
  negative: { cls: 'bg-red-50 text-red-800 ring-red-200', Icon: XCircleIcon, icon: 'text-red-500' },
  warning : { cls: 'bg-yellow-50 text-yellow-800 ring-yellow-200', Icon: ExclamationTriangleIcon, icon: 'text-yellow-500' },
  positive: { cls: 'bg-green-50 text-green-800 ring-green-200', Icon: CheckCircleIcon, icon: 'text-green-500' },
  info    : { cls: 'bg-blue-50 text-blue-800 ring-blue-200', Icon: InformationCircleIcon, icon: 'text-blue-500' },
  default : { cls: 'bg-gray-50 text-gray-800 ring-gray-200', Icon: null, icon: '' },
};

export const Message = ({
  negative, error, warning, positive, success, info,
  header, content, list, children, size, icon, onDismiss, compact, hidden, visible, attached, className, ...rest
}) => {
  if (hidden || visible === false) {
    return null;
  }

  const variant = (negative || error) ? 'negative'
    : warning ? 'warning'
      : (positive || success) ? 'positive'
        : info ? 'info' : 'default';
  const v = MESSAGE_VARIANTS[variant];
  const VariantIcon = v.Icon;

  return (
    <div
      role={variant === 'negative' ? 'alert' : 'status'}
      className={cx(
        'flex gap-3 rounded-md p-3 ring-1 ring-inset',
        size === 'tiny' || size === 'mini' || size === 'small' ? 'text-xs' : 'text-sm',
        compact ? 'inline-flex' : 'w-full',
        v.cls,
        className
      )}
      {...rest}
    >
      {icon && typeof icon !== 'boolean' ? renderIcon(icon, { className: 'mt-0.5' }) : (VariantIcon && <VariantIcon aria-hidden className={cx('size-5 shrink-0', v.icon)} />)}
      <div className="min-w-0 flex-1">
        {header && <div className="font-semibold">{header}</div>}
        {content && <div className={cx(header && 'mt-1')}>{content}</div>}
        {list && (
          <ul className="mt-1 list-disc pl-5">
            {list.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        )}
        {children}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="-m-1 rounded p-1 opacity-60 hover:opacity-100" aria-label="Dismiss">
          <XMarkIcon className="size-4" />
        </button>
      )}
    </div>
  );
};

Message.propTypes = {
  negative : PropTypes.bool,
  error    : PropTypes.bool,
  warning  : PropTypes.bool,
  positive : PropTypes.bool,
  success  : PropTypes.bool,
  info     : PropTypes.bool,
  header   : PropTypes.node,
  content  : PropTypes.node,
  list     : PropTypes.arrayOf(PropTypes.node),
  children : PropTypes.node,
  size     : PropTypes.string,
  icon     : PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  onDismiss: PropTypes.func,
  compact  : PropTypes.bool,
  hidden   : PropTypes.bool,
  visible  : PropTypes.bool,
  attached : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
};

/* ----------------------------------- Label ---------------------------------- */

export const Label = React.forwardRef(({
  as: As = 'span', color, circular, basic, size, content, icon, children, className, onClick, ...rest
}, ref) => (
  <As
    ref={ref}
    onClick={onClick ? e => onClick(e, { ...rest, content }) : undefined}
    className={cx(
      'inline-flex items-center gap-1 font-medium whitespace-nowrap',
      size === 'tiny' || size === 'mini' ? 'text-xs' : 'text-sm',
      circular ? 'min-w-6 justify-center rounded-full px-2 py-0.5' : 'rounded-md px-2 py-0.5',
      basic ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300' : (SOFT[color] || SOFT.default),
      onClick && 'cursor-pointer hover:brightness-95',
      className
    )}
    {...rest}
  >
    {renderIcon(icon)}
    {children ?? content}
  </As>
));

Label.displayName = 'Label';

Label.propTypes = {
  as       : PropTypes.elementType,
  color    : PropTypes.string,
  circular : PropTypes.bool,
  basic    : PropTypes.bool,
  size     : PropTypes.string,
  content  : PropTypes.node,
  icon     : PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.element]),
  children : PropTypes.node,
  className: PropTypes.string,
  onClick  : PropTypes.func,
};

const LabelGroup = ({ className, children, ...rest }) => (
  <div className={cx('flex flex-wrap gap-1', className)} {...rest}>{children}</div>
);

LabelGroup.propTypes = { className: PropTypes.string, children: PropTypes.node };
Label.Group = LabelGroup;

/* ----------------------------------- Flag ----------------------------------- */

/** Country flag (ISO 3166-1 alpha-2 code) via the flag-icons package. */
export const Flag = ({ name, className, ...rest }) => (
  name ? <span className={cx('fi', `fi-${name.toLowerCase()}`, 'mr-1.5 shrink-0 rounded-[2px]', className)} {...rest} /> : null
);

Flag.propTypes = { name: PropTypes.string, className: PropTypes.string };

/* ---------------------------------- Loader ---------------------------------- */

export const Loader = ({ active = true, inline, size, content, children, className }) => {
  if (!active) {
    return null;
  }

  const spinner = <Icon name="spinner" size={size === 'large' || size === 'big' ? 'big' : 'large'} className="text-gray-400" />;
  const label   = children ?? content;
  return (
    <div role="status" className={cx(inline ? 'inline-flex' : 'flex justify-center py-6', 'items-center gap-2 text-sm text-gray-500', className)}>
      {spinner}
      {label}
    </div>
  );
};

Loader.propTypes = {
  active   : PropTypes.bool,
  inline   : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  size     : PropTypes.string,
  content  : PropTypes.node,
  children : PropTypes.node,
  className: PropTypes.string,
};

/* ---------------------------------- Image ----------------------------------- */

export const Image = ({ centered, spaced, inline, size, className, alt = '', ...rest }) => (
  <img
    alt={alt}
    className={cx(
      centered ? 'mx-auto block' : 'inline-block',
      { 'mr-2': spaced === 'right' || spaced === true, 'ml-2': spaced === 'left' || spaced === true },
      'align-middle',
      className
    )}
    {...rest}
  />
);

Image.propTypes = {
  centered : PropTypes.bool,
  spaced   : PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['left', 'right'])]),
  inline   : PropTypes.bool,
  size     : PropTypes.string,
  className: PropTypes.string,
  alt      : PropTypes.string,
};

/* -------------------------------- Container --------------------------------- */

export const Container = ({ fluid, className, children, ...rest }) => (
  <div className={cx(fluid ? 'w-full' : 'mx-auto max-w-7xl', className)} {...rest}>{children}</div>
);

Container.propTypes = { fluid: PropTypes.bool, className: PropTypes.string, children: PropTypes.node };

/* --------------------------------- Sticky ----------------------------------- */

// Semantic's Sticky needed a `context` ref; CSS sticky positioning does the same job.
export const Sticky = ({ context, offset = 0, className, children, ...rest }) => (
  <div className={cx('sticky z-10 bg-white', className)} style={{ top: offset }} {...rest}>{children}</div>
);

Sticky.propTypes = {
  context  : PropTypes.any,
  offset   : PropTypes.number,
  className: PropTypes.string,
  children : PropTypes.node,
};

/* -------------------------------- Statistic --------------------------------- */

export const Statistic = ({ label, value, horizontal, size, className }) => (
  <div className={cx('inline-flex', horizontal ? 'items-baseline gap-2' : 'flex-col items-center', className)}>
    <span className="text-2xl font-semibold text-gray-900">{value}</span>
    <span className="text-sm font-medium uppercase text-gray-500">{label}</span>
  </div>
);

Statistic.propTypes = {
  label     : PropTypes.node,
  value     : PropTypes.node,
  horizontal: PropTypes.bool,
  size      : PropTypes.string,
  className : PropTypes.string,
};

/* -------------------------------- Breadcrumb -------------------------------- */

export const Breadcrumb = ({ className, children, ...rest }) => (
  <nav aria-label="Breadcrumb" className={cx('flex flex-wrap items-center gap-1 text-sm', className)} {...rest}>
    {children}
  </nav>
);

Breadcrumb.propTypes = { className: PropTypes.string, children: PropTypes.node };

const BreadcrumbSection = ({ as: As = 'span', link, active, onClick, className, children, content, ...rest }) => (
  <As
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={cx(
      active ? 'font-semibold text-gray-900' : 'text-gray-600',
      (link || onClick) && 'cursor-pointer text-blue-600 hover:underline',
      className
    )}
    {...rest}
  >
    {children ?? content}
  </As>
);

BreadcrumbSection.propTypes = {
  as       : PropTypes.elementType,
  link     : PropTypes.bool,
  active   : PropTypes.bool,
  onClick  : PropTypes.func,
  className: PropTypes.string,
  children : PropTypes.node,
  content  : PropTypes.node,
};

const BreadcrumbDivider = ({ icon, className }) => (
  <span className={cx('text-gray-400', className)} aria-hidden>{icon ? renderIcon(icon) : '/'}</span>
);

BreadcrumbDivider.propTypes = { icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), className: PropTypes.string };

Breadcrumb.Section = BreadcrumbSection;
Breadcrumb.Divider = BreadcrumbDivider;
