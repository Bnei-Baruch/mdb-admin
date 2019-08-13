import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ReactReduxContext } from 'react-redux';
import reduce from 'lodash/reduce';
import { Label } from 'semantic-ui-react';

import { filtersTransformer } from '../../../filters';
import { actions as filterActions, selectors as filterSelectors } from '../../../redux/modules/filters';
import { EMPTY_ARRAY } from '../../../helpers/consts';
import FilterTag from './FilterTag';

class FilterTags extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any
    })),
    removeFilterValue: PropTypes.func.isRequired,
    editExistingFilter: PropTypes.func.isRequired,
    changeFilterFromTag: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tags: EMPTY_ARRAY,
  };

  static contextType = ReactReduxContext;

  renderTag = (tag) => {
    const { namespace } = this.props;
    const {
            name, value, index, isActive
          }             = tag;

    const icon  = filtersTransformer.getTagIcon(name);
    const label = filtersTransformer.valueToTagLabel(name, value, this.props, this.context.store);
    return (
      <FilterTag
        key={`${name}_${index}`}
        icon={icon}
        isActive={isActive}
        label={label}
        onClick={() => {
          this.props.changeFilterFromTag();
          this.props.editExistingFilter(namespace, name, index);
        }}
        onClose={() => {
          this.props.removeFilterValue(namespace, name, value);
          this.props.changeFilterFromTag();
        }}
      />
    );
  };

  render() {
    const { tags } = this.props;

    if (tags.length === 0) {
      return null;
    }

    return (
      <div>
        <span>Active Filters:</span>&nbsp;&nbsp;
        <Label.Group style={{ display: 'inline-block' }}>
          {
            tags.map(this.renderTag)
          }
        </Label.Group>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => {
    // TODO (yaniv): use reselect to cache selector
    const filters      = filterSelectors.getFilters(state.filters, ownProps.namespace);
    const activeFilter = filterSelectors.getActiveFilter(state.filters, ownProps.namespace);

    const tags = reduce(filters, (acc, filter) => {
      const values = filter.values || [];
      return acc.concat(values.map((value, index) => {
        const activeValueIndex = filterSelectors.getActiveValueIndex(state.filters, ownProps.namespace, filter.name);
        return ({
          name: filter.name,
          index,
          value,
          isActive: activeFilter === filter.name && activeValueIndex === index
        });
      }));
    }, []);

    return { tags };
  },
  filterActions
)(FilterTags);
