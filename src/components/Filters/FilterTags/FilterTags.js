import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tags: EMPTY_ARRAY,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { tags, namespace } = this.props;
    const store               = this.context.store;

    if (tags.length === 0) {
      return null;
    }

    return (
      <div>
        <span>Active Filters:</span>&nbsp;&nbsp;
        <Label.Group style={{ display: 'inline-block' }}>
          {
            tags.map((tag) => {
              const icon  = filtersTransformer.getTagIcon(tag.name);
              const label = filtersTransformer.valueToTagLabel(tag.name, tag.value, this.props, store);
              return (
                <FilterTag
                  key={`${tag.name}_${tag.index}`}
                  icon={icon}
                  isActive={tag.isActive}
                  label={label}
                  onClick={() => this.props.editExistingFilter(namespace, tag.name, tag.index)}
                  onClose={() => {
                    this.props.removeFilterValue(namespace, tag.name, tag.value);
                    this.props.onClose();
                  }}
                />
              );
            })
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
