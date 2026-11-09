import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { BORDER_TOP } from './colors';

const SIZES = { mini: 'text-xs', tiny: 'text-sm', small: 'text-sm', large: 'text-lg', huge: 'text-xl' };
const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

const Segment = ({
  as: As = 'div',
  attached,
  basic,
  vertical,
  secondary,
  raised,
  compact,
  clearing,
  padded,
  floated,
  color,
  size,
  textAlign,
  loading,
  className,
  children,
  ...rest
}) => (
  <As
    className={cx(
      'relative',
      SIZES[size],
      ALIGN[textAlign],
      padded === 'very' ? 'p-8' : (padded ? 'p-6' : 'p-4'),
      {
        // basic: no box at all
        'bg-white border border-gray-200': !basic && !vertical,
        'border-b border-gray-200 px-0': vertical,
        'rounded-md': !basic && !vertical && !attached,
        'shadow-xs': !basic && !vertical && !attached && !secondary,
        'shadow-md': raised,
        // attached segments stack: share borders with the neighbour above/below
        '-mt-px': attached && attached !== 'top',
        'rounded-b-md': attached === 'bottom',
        'rounded-t-md': attached === 'top',
        'bg-gray-50': secondary,
        'inline-block': compact,
        'flow-root': clearing,
        'float-left mr-4': floated === 'left',
        'float-right ml-4': floated === 'right',
        'pointer-events-none opacity-60': loading,
      },
      BORDER_TOP[color],
      className
    )}
    {...rest}
  >
    {children}
  </As>
);

Segment.propTypes = {
  as       : PropTypes.elementType,
  attached : PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['top', 'bottom'])]),
  basic    : PropTypes.bool,
  vertical : PropTypes.bool,
  secondary: PropTypes.bool,
  raised   : PropTypes.bool,
  compact  : PropTypes.bool,
  clearing : PropTypes.bool,
  padded   : PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['very'])]),
  floated  : PropTypes.oneOf(['left', 'right']),
  color    : PropTypes.string,
  size     : PropTypes.string,
  textAlign: PropTypes.string,
  loading  : PropTypes.bool,
  className: PropTypes.string,
  children : PropTypes.node,
};

const SegmentGroup = ({ className, children, ...rest }) => (
  <div
    className={cx(
      'divide-y divide-gray-200 rounded-md border border-gray-200 bg-white shadow-xs',
      '[&>*]:rounded-none [&>*]:border-0 [&>*]:shadow-none',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

SegmentGroup.propTypes = { className: PropTypes.string, children: PropTypes.node };

Segment.Group = SegmentGroup;

export default Segment;
