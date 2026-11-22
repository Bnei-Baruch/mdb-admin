import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// 16-column grid (Semantic UI semantics) built on flexbox.
// Class names are listed in full so Tailwind can detect them.
const WIDTH = {
  1 : 'w-1/16',
  2 : 'w-2/16',
  3 : 'w-3/16',
  4 : 'w-4/16',
  5 : 'w-5/16',
  6 : 'w-6/16',
  7 : 'w-7/16',
  8 : 'w-8/16',
  9 : 'w-9/16',
  10: 'w-10/16',
  11: 'w-11/16',
  12: 'w-12/16',
  13: 'w-13/16',
  14: 'w-14/16',
  15: 'w-15/16',
  16: 'w-full',
};

const MD_WIDTH = {
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

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

const GridContext = React.createContext({ stackable: false, divided: false });
const RowContext  = React.createContext({ columns: null });

const Grid = ({ stackable, divided, reversed, columns, className, children, ...rest }) => (
  <GridContext.Provider value={{ stackable, divided }}>
    <RowContext.Provider value={{ columns: columns ? Number(columns) : null }}>
      <div
        className={cx(
          '-mx-3 -my-2 flex flex-wrap',
          { 'md:flex-row-reverse': reversed === 'computer' },
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </RowContext.Provider>
  </GridContext.Provider>
);

Grid.propTypes = {
  stackable: PropTypes.bool,
  divided  : PropTypes.bool,
  reversed : PropTypes.string,
  columns  : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  children : PropTypes.node,
};

const GridRow = ({ columns, className, children, ...rest }) => {
  const { divided } = React.useContext(GridContext);
  return (
    <RowContext.Provider value={{ columns: columns ? Number(columns) : null }}>
      <div
        className={cx('flex w-full flex-wrap', { '[&>*+*]:border-l [&>*+*]:border-gray-200': divided }, className)}
        {...rest}
      >
        {children}
      </div>
    </RowContext.Provider>
  );
};

GridRow.propTypes = {
  columns  : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  children : PropTypes.node,
};

const GridColumn = ({ width, textAlign, stretched, floated, className, children, ...rest }) => {
  const { stackable } = React.useContext(GridContext);
  const { columns }   = React.useContext(RowContext);

  const n      = width ? Number(width) : (columns ? Math.round(16 / columns) : null);
  const widths = stackable ? MD_WIDTH : WIDTH;

  return (
    <div
      className={cx(
        'min-w-0 px-3 py-2',
        n ? widths[n] : 'flex-1',
        ALIGN[textAlign],
        { 'flex flex-col [&>*]:flex-1': stretched, 'ml-auto': floated === 'right' },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

GridColumn.propTypes = {
  width    : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  textAlign: PropTypes.string,
  stretched: PropTypes.bool,
  floated  : PropTypes.string,
  className: PropTypes.string,
  children : PropTypes.node,
};

Grid.Row    = GridRow;
Grid.Column = GridColumn;

export default Grid;
