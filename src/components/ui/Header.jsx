import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { BORDER_TOP, SOFT, TEXT } from './colors';
import { renderIcon } from './Icon';

const SIZES = {
  tiny  : 'text-sm',
  small : 'text-base',
  medium: 'text-lg',
  large : 'text-xl',
  huge  : 'text-2xl',
};

const TAGS = { tiny: 'h5', small: 'h4', medium: 'h3', large: 'h2', huge: 'h1' };

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

const Header = ({
  as,
  content,
  children,
  color,
  size = 'medium',
  icon,
  sub,
  floated,
  textAlign,
  inverted,
  attached,
  block,
  dividing,
  className,
  ...rest
}) => {
  const As = as || (sub ? 'div' : TAGS[size] || 'h3');

  return (
    <As
      className={cx(
        'm-0 font-bold leading-tight',
        sub ? 'text-sm font-semibold uppercase tracking-wide text-gray-500' : SIZES[size],
        ALIGN[textAlign],
        {
          'float-left mr-3' : floated === 'left',
          'float-right ml-3': floated === 'right',
          // icon={true}: Semantic "icon header" — a large icon above centered text
          'flex flex-col items-center gap-3 [&>svg]:size-12': icon === true,
          'flex items-center gap-2': icon && icon !== true && textAlign !== 'center',
          'border-b border-gray-200 pb-2': dividing,
        },
        (attached || block)
          ? cx(
            'px-4 py-2.5 border border-gray-200',
            inverted ? SOFT[color] || SOFT.default : 'bg-gray-50',
            !inverted && BORDER_TOP[color],
            attached === 'bottom' ? 'rounded-b-md border-t-0' : (attached ? 'rounded-t-md' : 'rounded-md'),
          )
          : TEXT[color],
        className
      )}
      {...rest}
    >
      {renderIcon(icon)}
      {children ?? content}
    </As>
  );
};

Header.propTypes = {
  as       : PropTypes.elementType,
  content  : PropTypes.node,
  children : PropTypes.node,
  color    : PropTypes.string,
  size     : PropTypes.string,
  icon     : PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.object, PropTypes.element]),
  sub      : PropTypes.bool,
  floated  : PropTypes.oneOf(['left', 'right']),
  textAlign: PropTypes.string,
  inverted : PropTypes.bool,
  attached : PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['top', 'bottom'])]),
  block    : PropTypes.bool,
  dividing : PropTypes.bool,
  className: PropTypes.string,
};

const HeaderContent = ({ className, children, ...rest }) => (
  <div className={cx('inline-block', className)} {...rest}>{children}</div>
);

HeaderContent.propTypes = { className: PropTypes.string, children: PropTypes.node };

const HeaderSubheader = ({ className, children, content, ...rest }) => (
  <div className={cx('mt-0.5 text-sm font-normal text-gray-500', className)} {...rest}>{children ?? content}</div>
);

HeaderSubheader.propTypes = { className: PropTypes.string, children: PropTypes.node, content: PropTypes.node };

Header.Content   = HeaderContent;
Header.Subheader = HeaderSubheader;

export default Header;
