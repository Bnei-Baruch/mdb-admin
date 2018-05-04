import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

import connectFilter from './connectFilter';

class TextFilter extends Component {

  static propTypes = {
    value: PropTypes.string,
    onApply: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: ''
  };

  handleChange = (e, data) => {
    const { updateValue, onApply, isUpdateQuery } = this.props;
    updateValue(data.value, isUpdateQuery);
    onApply();
  };

  render() {
    const { value } = this.props;

    return (
      <Input
        fluid
        icon="search"
        placeholder="Search..."
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

export default connectFilter()(TextFilter);
