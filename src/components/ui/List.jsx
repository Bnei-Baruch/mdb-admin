import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from './Icon';

const ListContext = React.createContext({});

const List = ({
  as: As = 'div', divided, relaxed, horizontal, verticalAlign, floated, celled, bulleted, ordered, className, children, ...rest
}) => (
  <ListContext.Provider value={{ relaxed, horizontal, verticalAlign }}>
    <As
      role="list"
      className={cx(
        horizontal ? 'flex flex-wrap gap-x-4' : 'flex flex-col',
        {
          'divide-y divide-gray-200': (divided || celled) && !horizontal,
          'divide-x divide-gray-200 [&>*+*]:pl-4': (divided || celled) && horizontal,
          'items-center': horizontal && verticalAlign === 'middle',
          'float-right': floated === 'right',
          'float-left': floated === 'left',
          'list-disc pl-5': bulleted,
          'list-decimal pl-5': ordered,
        },
        className
      )}
      {...rest}
    >
      {children}
    </As>
  </ListContext.Provider>
);

List.propTypes = {
  as           : PropTypes.elementType,
  divided      : PropTypes.bool,
  relaxed      : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  horizontal   : PropTypes.bool,
  verticalAlign: PropTypes.string,
  floated      : PropTypes.string,
  celled       : PropTypes.bool,
  bulleted     : PropTypes.bool,
  ordered      : PropTypes.bool,
  className    : PropTypes.string,
  children     : PropTypes.node,
};

const ListItem = ({ as: As = 'div', className, children, content, onClick, active, ...rest }) => {
  const { relaxed, horizontal } = React.useContext(ListContext);
  return (
    <As
      role="listitem"
      onClick={onClick}
      className={cx(
        'flow-root',
        relaxed === 'very' ? 'py-3' : (relaxed ? 'py-2' : 'py-1'),
        { 'inline-flex items-center': horizontal, 'cursor-pointer': onClick, 'font-semibold': active },
        className
      )}
      {...rest}
    >
      {children ?? content}
    </As>
  );
};

ListItem.propTypes = {
  as       : PropTypes.elementType,
  className: PropTypes.string,
  children : PropTypes.node,
  content  : PropTypes.node,
  onClick  : PropTypes.func,
  active   : PropTypes.bool,
};

const ListContent = ({ floated, verticalAlign, className, children, content, ...rest }) => (
  <div
    className={cx(
      { 'float-right ml-4': floated === 'right', 'float-left mr-4': floated === 'left' },
      className
    )}
    {...rest}
  >
    {children ?? content}
  </div>
);

ListContent.propTypes = {
  floated      : PropTypes.string,
  verticalAlign: PropTypes.string,
  className    : PropTypes.string,
  children     : PropTypes.node,
  content      : PropTypes.node,
};

const ListHeader = ({ as: As = 'div', className, children, content, ...rest }) => (
  <As className={cx('font-semibold text-gray-900', className)} {...rest}>{children ?? content}</As>
);

ListHeader.propTypes = { as: PropTypes.elementType, className: PropTypes.string, children: PropTypes.node, content: PropTypes.node };

const ListDescription = ({ className, children, content, ...rest }) => (
  <div className={cx('text-sm text-gray-600', className)} {...rest}>{children ?? content}</div>
);

ListDescription.propTypes = { className: PropTypes.string, children: PropTypes.node, content: PropTypes.node };

const ListList = ({ className, children, ...rest }) => (
  <div role="list" className={cx('flex flex-col pl-5', className)} {...rest}>{children}</div>
);

ListList.propTypes = { className: PropTypes.string, children: PropTypes.node };

const ListIcon = props => <Icon {...props} className={cx('float-left mr-2', props.className)} />;

ListIcon.propTypes = { className: PropTypes.string };

List.Item        = ListItem;
List.Content     = ListContent;
List.Header      = ListHeader;
List.Description = ListDescription;
List.List        = ListList;
List.Icon        = ListIcon;

export default List;
