import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';

import ListWithFiltersBase from './ListWithFiltersBase';

class ListWithCheckboxBase extends ListWithFiltersBase {
  static propTypes = {
    ...ListWithFiltersBase.propTypes,
    items: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);
    this.state.selectedIds = [];
  }

  isSingleSelect = false;

  getSelectListProps = () => {
    return {
      select: this.selectItem,
      selectAll: this.selectAllItems,
      selectedIds: this.state.selectedIds,
      associatedIds: this.props.associatedIds,
    };
  };

  selectItem = (id, checked) => {
    const { selectedIds } = this.state;

    if (this.isSingleSelect) {
      this.singleSelect(id, checked);
      return;
    }

    if (checked) {
      selectedIds.push(id);
    } else {
      selectedIds.splice(selectedIds.findIndex(x => id === x), 1);
    }
    this.setState({ selectedIds: [...selectedIds] });
  };

  singleSelect = (id, checked) => {
    if (checked) {
      this.setState({ selectedIds: [id] });
      return;
    }
    this.setState({ selectedIds: [] });
  };

  selectAllItems = (checked) => {
    const { items, associatedIds } = this.props;
    const { selectedIds }          = this.state;
    if (checked) {
      this.setState({ selectedIds: uniq([...selectedIds, ...items.filter(c => !associatedIds.includes(c.id)).map(x => x.id)]) });
    } else {
      this.setState({ selectedIds: selectedIds.filter(id => !items.some(y => id === y.id)) });
    }
  };

  render() {
    throw new Error('Not Implemented');
    // eslint-disable-next-line no-unreachable
    return null;
  }
}

export default ListWithCheckboxBase;
