import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/sources';
import SourcesSearch from '../../Autocomplete/SourcesSearch';
import * as shapes from '../../shapes';
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

  handleSelect = (source) => this.props.onChange(this.props.getSourceById(source.id));

  handleRemove = () => this.props.onChange();

  render() {
    const { value, dispatch, getSourceById, err, onChange, source, ...rest } = this.props;

    return (
      <Form.Field error={err} {...rest}>
        {
          source ?
            (
              <div>
                <SourceBreadcrumbs source={source} lastIsLink />
                <Button
                  onClick={() => this.handleRemove()}
                  circular
                  compact
                  size="mini"
                  icon="remove"
                  color="red"
                  inverted
                  floated="right"
                />
                <br /><br />
              </div>
            ) :
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
