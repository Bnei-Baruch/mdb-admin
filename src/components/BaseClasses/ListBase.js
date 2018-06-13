import  { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ListBase extends PureComponent {

  static propTypes = {
    select: PropTypes.func,
    selectAll: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.number),
    associatedIds: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    items: [],
    selectedIds: [],
    associatedIds: [],
  };

  selectHandler = (x, checked) => {
    this.props.select(x.id, checked);
  };

  selectAllHandler = (event, data) => {
    this.props.selectAll(data.checked);
  };

  isAllSelected = () => {
    const { selectedIds, items, associatedIds } = this.props;

    //prevent check
    if (selectedIds.length < (items.length - associatedIds.length)) {
      return false;
    }

    const countAssociatedInPage = items.filter(x => associatedIds.includes(x.id)).length;
    //check that not all associated
    if (countAssociatedInPage === items.length) {
      return false;
    }

    return (countAssociatedInPage + items.filter(x => selectedIds.includes(x.id)).length) === items.length;
  };

  render() {
    throw new Error('Not Implemented');
    // eslint-disable-next-line no-unreachable
    return null;
  }
}

export default ListBase;