import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Form } from 'semantic-ui-react';

import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, MAJOR_LANGUAGES } from '../../../helpers/consts';
import NameField from './Name';

class MajorLangsI18n extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...props.i18n,
    };
  }

  handleI18nChange = (e, data) => {
    const { id, value } = data;
    const language      = id.substring(0, 2);
    this.setState({ [language]: { name: value } },
      () => this.props.onChange(this.state));
  };

  render() {
    const { i18n, err } = this.props;

    return (
      <div>
        <Form.Group widths="equal">
          <NameField
            language={LANG_HEBREW}
            value={i18n[LANG_HEBREW].name}
            err={err}
            onChange={this.handleI18nChange}
          />
          <NameField
            language={LANG_RUSSIAN}
            value={i18n[LANG_RUSSIAN].name}
            err={err}
            onChange={this.handleI18nChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <NameField
            language={LANG_ENGLISH}
            value={i18n[LANG_ENGLISH].name}
            err={err}
            onChange={this.handleI18nChange}
          />
          <NameField
            language={LANG_SPANISH}
            value={i18n[LANG_SPANISH].name}
            onChange={this.handleI18nChange}
          />
        </Form.Group>
      </div>
    );
  }
}

MajorLangsI18n.propTypes = {
  i18n: PropTypes.objectOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  err: PropTypes.bool,
  onChange: PropTypes.func,
};

MajorLangsI18n.defaultProps = {
  i18n: MAJOR_LANGUAGES.reduce((acc, val) => {
    acc[val] = { name: '' };
    return acc;
  }, {}),
  err: false,
  onChange: noop,
};

export default MajorLangsI18n;
