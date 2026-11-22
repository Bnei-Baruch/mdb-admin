import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const TableContext = React.createContext({});

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

// Semantic's `width` on a cell is N/16 of the table.
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

const Table = ({
  compact, basic, celled, selectable, striped, sortable, fixed, size, unstackable, collapsing, className, children, ...rest
}) => (
  <TableContext.Provider value={{ compact, celled, selectable, striped, sortable }}>
    <div className={cx('overflow-x-auto', !basic && 'rounded-md border border-gray-200 bg-white')}>
      <table
        className={cx(
          'min-w-full border-collapse',
          size === 'small' || compact ? 'text-sm' : 'text-sm',
          { 'table-fixed': fixed, 'w-auto min-w-0': collapsing },
          className
        )}
        {...rest}
      >
        {children}
      </table>
    </div>
  </TableContext.Provider>
);

Table.propTypes = {
  compact    : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  basic      : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  celled     : PropTypes.bool,
  selectable : PropTypes.bool,
  striped    : PropTypes.bool,
  sortable   : PropTypes.bool,
  fixed      : PropTypes.bool,
  size       : PropTypes.string,
  unstackable: PropTypes.bool,
  collapsing : PropTypes.bool,
  className  : PropTypes.string,
  children   : PropTypes.node,
};

const TableHeader = ({ className, children, ...rest }) => (
  <thead className={cx('bg-gray-50', className)} {...rest}>{children}</thead>
);

TableHeader.propTypes = { className: PropTypes.string, children: PropTypes.node };

const TableBody = ({ className, children, ...rest }) => {
  const { striped } = React.useContext(TableContext);
  return (
    <tbody className={cx('divide-y divide-gray-200', striped && '[&>tr:nth-child(even)]:bg-gray-50', className)} {...rest}>
      {children}
    </tbody>
  );
};

TableBody.propTypes = { className: PropTypes.string, children: PropTypes.node };

const TableFooter = ({ className, children, ...rest }) => (
  <tfoot className={cx('border-t border-gray-200 bg-gray-50', className)} {...rest}>{children}</tfoot>
);

TableFooter.propTypes = { className: PropTypes.string, children: PropTypes.node };

const TableRow = ({ disabled, error, negative, warning, positive, active, className, children, ...rest }) => {
  const { selectable } = React.useContext(TableContext);
  return (
    <tr
      className={cx(
        {
          'hover:bg-gray-50': selectable && !active,
          'pointer-events-none text-gray-400': disabled,
          'bg-red-50 text-red-900': error || negative,
          'bg-yellow-50 text-yellow-900': warning,
          'bg-green-50 text-green-900': positive,
          'bg-blue-50': active,
        },
        className
      )}
      {...rest}
    >
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  disabled : PropTypes.bool,
  error    : PropTypes.bool,
  negative : PropTypes.bool,
  warning  : PropTypes.bool,
  positive : PropTypes.bool,
  active   : PropTypes.bool,
  className: PropTypes.string,
  children : PropTypes.node,
};

const cellClasses = ({ compact, celled }, { collapsing, textAlign, width, singleLine, verticalAlign }) => cx(
  compact ? 'px-2 py-1.5' : 'px-3 py-2',
  {
    'w-px whitespace-nowrap': collapsing,
    'whitespace-nowrap': singleLine,
    'align-top': verticalAlign === 'top',
    'align-middle': verticalAlign !== 'top',
    'border-x border-gray-200': celled,
  },
  ALIGN[textAlign],
  WIDTH[width],
);

const TableHeaderCell = ({
  collapsing, textAlign, width, singleLine, verticalAlign, sorted, onClick, className, children, content, ...rest
}) => {
  const ctx = React.useContext(TableContext);
  return (
    <th
      scope="col"
      onClick={onClick}
      aria-sort={sorted ? (sorted === 'ascending' ? 'ascending' : 'descending') : undefined}
      className={cx(
        'text-left font-semibold text-gray-900',
        cellClasses(ctx, { collapsing, textAlign, width, singleLine, verticalAlign }),
        onClick && 'cursor-pointer select-none hover:bg-gray-100',
        className
      )}
      {...rest}
    >
      {children ?? content}
      {sorted && <span className="ml-1 text-gray-500">{sorted === 'ascending' ? '▲' : '▼'}</span>}
    </th>
  );
};

TableHeaderCell.propTypes = {
  collapsing   : PropTypes.bool,
  textAlign    : PropTypes.string,
  width        : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  singleLine   : PropTypes.bool,
  verticalAlign: PropTypes.string,
  sorted       : PropTypes.oneOf(['ascending', 'descending', null, undefined]),
  onClick      : PropTypes.func,
  className    : PropTypes.string,
  children     : PropTypes.node,
  content      : PropTypes.node,
};

const TableCell = ({
  collapsing, textAlign, width, singleLine, verticalAlign, error, negative, positive, warning, disabled, selectable,
  className, children, content, ...rest
}) => {
  const ctx = React.useContext(TableContext);
  return (
    <td
      className={cx(
        'text-gray-800',
        cellClasses(ctx, { collapsing, textAlign, width, singleLine, verticalAlign }),
        {
          'bg-red-50 text-red-900': error || negative,
          'bg-green-50 text-green-900': positive,
          'bg-yellow-50 text-yellow-900': warning,
          'text-gray-400': disabled,
        },
        className
      )}
      {...rest}
    >
      {children ?? content}
    </td>
  );
};

TableCell.propTypes = {
  collapsing   : PropTypes.bool,
  textAlign    : PropTypes.string,
  width        : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  singleLine   : PropTypes.bool,
  verticalAlign: PropTypes.string,
  error        : PropTypes.bool,
  negative     : PropTypes.bool,
  positive     : PropTypes.bool,
  warning      : PropTypes.bool,
  disabled     : PropTypes.bool,
  selectable   : PropTypes.bool,
  className    : PropTypes.string,
  children     : PropTypes.node,
  content      : PropTypes.node,
};

Table.Header     = TableHeader;
Table.Body       = TableBody;
Table.Footer     = TableFooter;
Table.Row        = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell       = TableCell;

export default Table;
