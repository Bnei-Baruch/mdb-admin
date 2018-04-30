import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Form } from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../../helpers/consts';
import { extractI18n } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/tags';
import { selectors as system } from '../../../redux/modules/system';

class HolidayField extends PureComponent {

  static propTypes = {
    value: PropTypes.string,
    err: PropTypes.bool,
    onChange: PropTypes.func,
    currentLanguage: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      title: PropTypes.string,
    }))
  };

  static defaultProps = {
    value: '',
    err: false,
    onChange: noop,
    options: EMPTY_ARRAY,
  };

  render() {
    const { value, err, onChange, options } = this.props;

    return (
      <Form.Dropdown
        fluid
        search
        selection
        required
        label="Holiday"
        placeholder="Holiday"
        defaultValue={value}
        options={options}
        error={err}
        onChange={onChange}
      />
    );
  }
}

const mapState = (state) => {
  const holidaysRoot    = selectors.getTagByUID(state.tags)('1nyptSIo');
  const hierarchy       = selectors.getHierarchy(state.tags);
  const childs          = hierarchy.childMap.get(holidaysRoot.id) || EMPTY_ARRAY;
  const holidayTags     = selectors.denormIDs(state.tags)(childs);
  const currentLanguage = system.getCurrentLanguage(state.system);

  return {
    options: holidayTags.map(x => ({
      value: x.uid,
      text: extractI18n(x.i18n, ['label'], currentLanguage)[0]
    }))
  };
};

export default connect(mapState)(HolidayField);
