import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID } from '../../helpers/consts';
import connectFilter from './connectFilter';

class ContentTypeFilter extends Component {

  static propTypes = {
    updateValue: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.any),
    onApply: PropTypes.func.isRequired,
  };

  static defaultProps = {
    options: Array.from(Object.values(CONTENT_TYPE_BY_ID)).map(x => ({ key: x, value: x, text: x }))
  };

  handleChange = (e, data) => {
    const { updateValue, onApply, isUpdateQuery } = this.props;
    updateValue(data.value, isUpdateQuery);
    onApply();
  };

  render() {
    return (
      <Dropdown
        search
        selection
        fluid
        placeholder="Content Type"
        options={this.props.options}
        onChange={this.handleChange}
        selectOnBlur={false}
      />
    );
  }
}

export default connectFilter({ isMultiple: true })(ContentTypeFilter);
