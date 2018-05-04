import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Form } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/sources';
import * as shapes from '../../shapes';
import SourcesSearch from '../../Autocomplete/SourcesSearch';
import SourceBreadcrumbs from '../../Sources/SourceBreadcrumbs';

class SourceField extends PureComponent {

  static propTypes = {
    value: PropTypes.string,
    err: PropTypes.bool,
    onChange: PropTypes.func,
    source: shapes.Source,
    getSourceById: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: '',
    err: false,
    onChange: noop,
    source: null,
  };

  handleSelect = (source) => {
    this.props.onChange(this.props.getSourceById(source.id));
  };

  render() {
    const { value, dispatch, getSourceById, err, onChange, source, ...rest } = this.props;

    return (
      <Form.Field error={err} {...rest}>
        {
          source ?
            <div><SourceBreadcrumbs source={source} lastIsLink /><br /><br /></div> :
            null
        }
        <SourcesSearch placeholder="הוסף מקור" onSelect={this.handleSelect} />
      </Form.Field>
    );
  }
}

const mapState = (state, ownProps) => {
  const { value }      = ownProps;
  const getSourceByUID = selectors.getSourceByUID(state.sources);
  return {
    getSourceById: selectors.getSourceById(state.sources),
    source: value ? getSourceByUID(value) : null
  };
};

export default connect(mapState, null)(SourceField);
