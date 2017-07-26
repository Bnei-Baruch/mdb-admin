import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import { OPERATION_TYPE_BY_ID, EMPTY_ARRAY } from '../../helpers/consts';
import connectFilter from './connectFilter';

class OperationTypeFilter extends Component {

  static propTypes = {
    updateValue: PropTypes.func.isRequired,
    allValues: PropTypes.arrayOf(PropTypes.string),
    onApply: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allValues: EMPTY_ARRAY,
  };

  handleChange = (e, data) => {
    this.props.updateValue(data.value);
    this.props.onApply();
  };

  render() {
    const { allValues } = this.props;
    const options       = Array.from(Object.values(OPERATION_TYPE_BY_ID))
      .filter(x => allValues.findIndex(y => y === x) === -1)
      .map(x => ({ key: x, value: x, text: x }));

    return (
      <Dropdown
        search
        selection
        fluid
        placeholder="Operation Type"
        onChange={this.handleChange}
        options={options}
      />
    );
  }
}

export default connectFilter({ isMultiple: true })(OperationTypeFilter);