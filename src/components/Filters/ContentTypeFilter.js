import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY } from '../../helpers/consts';
import connectFilter from './connectFilter';

class ContentTypeFilter extends Component {

  static propTypes = {
    updateValue: PropTypes.func.isRequired,
    allValues: PropTypes.arrayOf(PropTypes.any),
    onApply: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allValues: EMPTY_ARRAY,
  };

  handleChange = (e, data) => {
    const { updateValue, onApply, isUpdateQuery } = this.props;
    updateValue(data.value, isUpdateQuery);
    onApply();
  };

  render() {
    const { allValues } = this.props;
    const options       = Array.from(Object.values(CONTENT_TYPE_BY_ID))
      .filter(x => allValues.findIndex(y => y === x) === -1)
      .map(x => ({ key: x, value: x, text: x }));

    return (
      <Dropdown
        search
        selection
        fluid
        placeholder="Content Type"
        options={options}
        onChange={this.handleChange}
        selectOnBlur={false}
      />
    );
  }
}

export default connectFilter({ isMultiple: true })(ContentTypeFilter);
