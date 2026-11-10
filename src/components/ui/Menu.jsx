import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// Variants used in the app:
//  - toolbar:    <Menu attached borderless size="large"> + <Menu.Item header> + <Menu.Menu position="right">
//  - nav:        <Menu pointing> with NavLink items (react-router adds `.active`)
//  - tabs:       <Menu secondary pointing>
//  - vertical:   <Menu fluid vertical [tabular="right"]>
//  - pagination: <Menu compact pagination>

const MenuContext = React.createContext({ variant: 'bar' });

const variantOf = ({ vertical, pagination, secondary, pointing, tabular }) => {
  if (pagination) return 'pagination';
  if (vertical) return tabular ? 'vertical-tabs' : 'vertical';
  if (secondary || tabular) return 'tabs';
  if (pointing) return 'nav';
  return 'bar';
};

const MENU_CLASSES = {
  'bar'          : 'flex min-h-11 items-stretch border border-gray-200 bg-white',
  'nav'          : 'flex flex-wrap min-h-12 items-stretch rounded-md border border-gray-200 bg-white shadow-xs',
  'tabs'         : 'flex items-stretch gap-1 border-b border-gray-200',
  'vertical'     : 'flex flex-col rounded-md border border-gray-200 bg-white divide-y divide-gray-100',
  'vertical-tabs': 'flex flex-col border-r border-gray-200',
  'pagination'   : 'inline-flex items-stretch rounded-md border border-gray-300 bg-white divide-x divide-gray-300 text-sm',
};

const ITEM_CLASSES = {
  'bar'          : 'px-4 py-2',
  'nav'          : 'px-4 py-3 border-b-2 border-transparent [&.active]:border-blue-600 [&.active]:text-blue-700 [&.active]:font-semibold',
  'tabs'         : '-mb-px px-4 py-2 border-b-2',
  'vertical'     : 'px-4 py-2.5',
  'vertical-tabs': '-mr-px px-4 py-2.5 border-r-2',
  'pagination'   : 'px-3 py-1.5 justify-center min-w-9',
};

// Applied only when the item is NOT active, so they never compete with ITEM_ACTIVE
// (with conflicting utilities Tailwind's stylesheet order wins, not the order in cx()).
const ITEM_INACTIVE = {
  'tabs'         : 'border-transparent',
  'vertical-tabs': 'border-transparent',
};

const ITEM_ACTIVE = {
  'bar'          : 'bg-gray-100 font-semibold',
  'nav'          : 'border-blue-600 text-blue-700 font-semibold',
  'tabs'         : 'border-blue-600 text-blue-700 font-semibold hover:text-blue-700',
  'vertical'     : 'bg-blue-50 text-blue-700 font-semibold',
  'vertical-tabs': 'border-blue-600 bg-blue-50 text-blue-700 font-semibold',
  'pagination'   : 'bg-blue-50 text-blue-700 font-semibold',
};

const Menu = ({
  attached, borderless, size, fluid, vertical, pointing, secondary, tabular, pagination, compact, color,
  className, children, ...rest
}) => {
  const variant = variantOf({ vertical, pagination, secondary, pointing, tabular });
  return (
    <MenuContext.Provider value={{ variant, borderless }}>
      <div
        className={cx(
          MENU_CLASSES[variant],
          size === 'tiny' || size === 'mini' ? 'text-sm' : (size === 'large' ? 'text-base' : 'text-sm'),
          {
            'rounded-t-md': attached === true || attached === 'top',
            'rounded-b-md': attached === 'bottom',
            'rounded-md'  : variant === 'bar' && !attached,
            'divide-x divide-gray-200': variant === 'bar' && !borderless,
            'w-full'      : fluid,
          },
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
};

Menu.propTypes = {
  attached  : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  borderless: PropTypes.bool,
  size      : PropTypes.string,
  fluid     : PropTypes.bool,
  vertical  : PropTypes.bool,
  pointing  : PropTypes.bool,
  secondary : PropTypes.bool,
  tabular   : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  pagination: PropTypes.bool,
  compact   : PropTypes.bool,
  color     : PropTypes.string,
  className : PropTypes.string,
  children  : PropTypes.node,
};

const MenuItem = ({
  as, header, active, disabled, position, name, content, onClick, className, children, ...rest
}) => {
  const { variant } = React.useContext(MenuContext);
  const clickable   = !!onClick || !!as || !!rest.href || !!rest.to;
  const As          = as || (rest.href ? 'a' : (onClick ? 'button' : 'div'));

  const handleClick = e => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick(e, { ...rest, name, active, disabled, content });
    }
  };

  const label = children ?? content ?? name;

  return (
    <As
      type={As === 'button' ? 'button' : undefined}
      aria-disabled={disabled || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={handleClick}
      className={cx(
        'flex items-center gap-2 text-left whitespace-nowrap',
        ITEM_CLASSES[variant],
        {
          'font-bold text-gray-900': header,
          'cursor-pointer hover:bg-gray-50': clickable && !disabled,
          'text-gray-700 hover:text-gray-900': clickable && !disabled && !active,
          'pointer-events-none opacity-40': disabled,
          'ml-auto': position === 'right',
        },
        active ? ITEM_ACTIVE[variant] : ITEM_INACTIVE[variant],
        className
      )}
      {...rest}
    >
      {label}
    </As>
  );
};

MenuItem.propTypes = {
  as       : PropTypes.elementType,
  header   : PropTypes.bool,
  active   : PropTypes.bool,
  disabled : PropTypes.bool,
  position : PropTypes.oneOf(['left', 'right']),
  name     : PropTypes.string,
  content  : PropTypes.node,
  onClick  : PropTypes.func,
  className: PropTypes.string,
  children : PropTypes.node,
};

const MenuMenu = ({ position, className, children, ...rest }) => {
  const { borderless } = React.useContext(MenuContext);
  return (
    <div
      className={cx(
        'flex items-stretch',
        { 'ml-auto': position === 'right', 'divide-x divide-gray-200 border-l border-gray-200': !borderless },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

MenuMenu.propTypes = {
  position : PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  children : PropTypes.node,
};

Menu.Item = MenuItem;
Menu.Menu = MenuMenu;

export default Menu;
