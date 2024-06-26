import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as shapes from '../shapes';
import { actions, selectors } from '../../redux/modules/labels';
import MainPage from './MainPage';
import { withRouter } from '../../helpers/withRouterPatch';

class Container extends Component {
  static propTypes = {
    match    : shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.askForData(id);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id } } } = prevProps;
    const nId                           = this.props.match.params.id;
    if (id !== nId) {
      this.askForData(nId);
    }
  }

  askForData(id) {
    const x = Number.parseInt(id, 10);
    if (Number.isNaN(x)) {
      return;
    }

    this.props.fetchItem(x);
  }

  render() {
    return <MainPage {...this.props} />;
  }
}

const mapState = (state, props) => ({
  label: selectors.getLabelById(state.labels, parseInt(props.match.params.id, 10)),
  wip  : selectors.getWIP(state.labels, 'fetchItem'),
  err  : selectors.getError(state.labels, 'fetchItem'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItem: actions.fetchItem,
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(Container));
