import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { OUTLINE, SOLID } from './colors';
import Icon, { renderIcon } from './Icon';

const SIZES = {
  mini  : 'px-2 py-1 text-xs gap-1',
  tiny  : 'px-2.5 py-1 text-xs gap-1',
  small : 'px-3 py-1.5 text-sm gap-1.5',
  medium: 'px-3.5 py-2 text-sm gap-1.5',
  large : 'px-4 py-2.5 text-base gap-2',
  big   : 'px-5 py-3 text-base gap-2',
  huge  : 'px-6 py-3 text-lg gap-2',
};

const ICON_ONLY_SIZES = {
  mini  : 'p-1',
  tiny  : 'p-1.5',
  small : 'p-1.5',
  medium: 'p-2',
  large : 'p-2.5',
  big   : 'p-3',
  huge  : 'p-3.5',
};

const ButtonGroupContext = React.createContext(null);

export const buttonClasses = ({
  color, primary, basic, inverted, size = 'medium', compact, circular, fluid, floated, active, iconOnly, className,
}) => {
  const c = primary ? 'primary' : (color || 'default');
  return cx(
    'inline-flex items-center justify-center font-semibold shadow-xs cursor-pointer select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // `inverted` was used on dark (basic) modals; on the new light modals it means nothing special.
    basic && !inverted ? OUTLINE[c] || OUTLINE.default : SOLID[c] || SOLID.default,
    iconOnly ? ICON_ONLY_SIZES[size] : SIZES[size],
    compact && !iconOnly && 'px-2 py-1',
    circular ? 'rounded-full' : 'rounded-md',
    {
      'w-full'                       : fluid,
      'float-right ml-2'             : floated === 'right',
      'float-left mr-2'              : floated === 'left',
      'ring-2 ring-inset ring-black/20': active,
    },
    className
  );
};

const Button = React.forwardRef(({
  as: As = 'button',
  children,
  content,
  icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  color,
  primary,
  basic,
  inverted,
  size,
  compact,
  circular,
  fluid,
  floated,
  active,
  className,
  labelPosition, // eslint-disable-line no-unused-vars
  ...rest
}, ref) => {
  const group = React.useContext(ButtonGroupContext) || {};
  const label = children ?? content;
  const iconOnly = !!icon && (label === undefined || label === null || label === '');

  const handleClick = e => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e, { ...rest, content, icon, color, disabled, loading });
    }
  };

  const typeProps = As === 'button' ? { type, disabled: disabled || loading } : { 'aria-disabled': disabled || undefined };

  return (
    <As
      ref={ref}
      className={buttonClasses({
        color: color || group.color,
        primary,
        basic: basic ?? group.basic,
        inverted,
        size : size || group.size,
        compact,
        circular,
        fluid,
        floated,
        active,
        iconOnly,
        className: cx(group.inGroup && 'rounded-none first:rounded-l-md last:rounded-r-md', className),
      })}
      onClick={handleClick}
      {...typeProps}
      {...rest}
    >
      {loading ? <Icon name="spinner" /> : renderIcon(icon)}
      {label}
    </As>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  as      : PropTypes.elementType,
  children: PropTypes.node,
  content : PropTypes.node,
  icon    : PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.element]),
  loading : PropTypes.bool,
  disabled: PropTypes.bool,
  onClick : PropTypes.func,
  type    : PropTypes.string,
  color   : PropTypes.string,
  primary : PropTypes.bool,
  basic   : PropTypes.bool,
  inverted: PropTypes.bool,
  size    : PropTypes.oneOf(['mini', 'tiny', 'small', 'medium', 'large', 'big', 'huge']),
  compact : PropTypes.bool,
  circular: PropTypes.bool,
  fluid   : PropTypes.bool,
  floated : PropTypes.oneOf(['left', 'right']),
  active  : PropTypes.bool,
  className: PropTypes.string,
};

const ButtonGroup = ({ color, basic, size, className, children, labeled, ...rest }) => ( // eslint-disable-line no-unused-vars
  <ButtonGroupContext.Provider value={{ color, basic, size, inGroup: true }}>
    <span className={cx('isolate inline-flex rounded-md shadow-xs [&>*:not(:first-child)]:-ml-px', className)} {...rest}>
      {children}
    </span>
  </ButtonGroupContext.Provider>
);

ButtonGroup.propTypes = {
  color    : PropTypes.string,
  basic    : PropTypes.bool,
  size     : PropTypes.string,
  className: PropTypes.string,
  children : PropTypes.node,
  labeled  : PropTypes.bool,
};

Button.Group = ButtonGroup;

export { ButtonGroupContext };
export default Button;
