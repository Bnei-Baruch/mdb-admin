import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import { SECURITY_LEVELS, EMPTY_ARRAY } from '../../helpers/consts';
import connectFilter from './connectFilter';

class SecureFilter extends Component {

  static propTypes = {
    updateValue: PropTypes.func.isRequired,
    allValues: PropTypes.arrayOf(PropTypes.any),
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
    const options       = Array.from(Object.values(SECURITY_LEVELS))
      .filter(x => allValues.findIndex(y => y === x.value) === -1)
      .map(x => ({ key: x.value, value: x.value, text: x.text }));

    return (
      <Dropdown
        selection
        fluid
        placeholder="Security Level"
        options={options}
        onChange={this.handleChange}
        selectOnBlur={false}
      />
    );
  }
}

export default connectFilter({ isMultiple: true })(SecureFilter);
