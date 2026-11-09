import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import connectFilter from './connectFilter';

class PublishedFilter extends Component {
  static propTypes = {
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.oneOf([null, true, false]),
    onApply: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  handleTrue = () => this.handleChange(true);

  handleFalse = () => this.handleChange(false);

  handleChange = (value) => {
    if (value !== this.props.value) {
      const { updateValue, onApply, isUpdateQuery } = this.props;
      updateValue(value, isUpdateQuery);
      onApply();
    }
  };

  render() {
    const { value } = this.props;

    return (
      <Button.Group labeled basic>
        <Button
          content="True"
          active={value === true}
          icon={{ name: 'checkmark', color: 'green' }}
          onClick={this.handleTrue}
        />
        <Button
          content="False"
          active={value === false}
          icon={{ name: 'ban', color: 'red' }}
          onClick={this.handleFalse}
        />
      </Button.Group>
    );
  }
}

export default connectFilter()(PublishedFilter);
