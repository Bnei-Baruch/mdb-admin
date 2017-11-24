import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Menu, Segment } from 'semantic-ui-react';

import { actions, selectors } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';
import UpdateContentUnitPropertiesForm from '../../../shared/Forms/ContentUnit/UpdateContentUnitPropertiesForm';

const Properties = (props) => {
  const { unit, wip, err, updateProperties } = props;
  return (
    <div>
      <Menu attached borderless size="large">
        <Menu.Item header>
          <Header content="Extra properties" size="medium" color="blue" />
        </Menu.Item>
      </Menu>
      <Segment attached>
        <UpdateContentUnitPropertiesForm
          unit={unit}
          wip={wip}
          err={err}
          update={updateProperties}
        />
      </Segment>
    </div>
  );
};

Properties.propTypes = {
  unit: shapes.ContentUnit,
  wip: PropTypes.bool,
  err: shapes.Error,
  updateProperties: PropTypes.func.isRequired,
};

Properties.defaultProps = {
  unit: null,
  wip: false,
  err: null,
};

const mapState = state => ({
  wip: selectors.getWIP(state.content_units, 'updateProperties'),
  err: selectors.getError(state.content_units, 'updateProperties'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ updateProperties: actions.updateProperties }, dispatch);
}

export default connect(mapState, mapDispatch)(Properties);
