import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Menu, Segment } from 'semantic-ui-react';

import { actions, selectors } from '../../../../redux/modules/collections';
import * as shapes from '../../../shapes';
import UpdateCollectionPropertiesForm from '../../../shared/Forms/Collection/UpdateCollectionPropertiesForm';

const Properties = (props) => {
  const {
    collection, wip, err, updateProperties
  } = props;

  return (
    <div>
      <Menu attached borderless size="large">
        <Menu.Item header>
          <Header content="Extra properties" size="medium" color="blue" />
        </Menu.Item>
      </Menu>
      <Segment attached>
        <UpdateCollectionPropertiesForm
          collection={collection}
          wip={wip}
          err={err}
          update={updateProperties}
        />
      </Segment>
    </div>
  );
};

Properties.propTypes = {
  collection: shapes.Collection,
  wip: PropTypes.bool,
  err: shapes.Error,
  updateProperties: PropTypes.func.isRequired,
};

Properties.defaultProps = {
  collection: null,
  wip: false,
  err: null,
};

const mapState = state => ({
  wip: selectors.getWIP(state.collections, 'updateProperties'),
  err: selectors.getError(state.collections, 'updateProperties'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ updateProperties: actions.updateProperties }, dispatch);
}

export default connect(mapState, mapDispatch)(Properties);
