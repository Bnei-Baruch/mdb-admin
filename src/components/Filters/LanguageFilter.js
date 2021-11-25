import React, { Component } from 'react';
import PropTypes from 'prop-types';

import connectFilter from './connectFilter';
import { LANG_MULTI } from '../../helpers/consts';
import LanguageSelector from '../shared/LanguageSelector';

class LanguageFilter extends Component {
  static propTypes    = {
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    onApply: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: ''
  };

  handleChange = (e, data) => {
    const { updateValue, onApply, isUpdateQuery } = this.props;
    updateValue(data.value, isUpdateQuery);
    onApply(true);
  };

  render() {
    const { value } = this.props;

    return (
      <LanguageSelector
        selection
        defaultValue={value}
        onChange={this.handleChange}
        exclude={[LANG_MULTI]}
      />
    );
  }
}

export default connectFilter()(LanguageFilter);
