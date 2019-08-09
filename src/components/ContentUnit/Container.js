import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/content_units';
import { selectors as system } from '../../redux/modules/system';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class Container extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
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
  unit: selectors.getContentUnitById(state.content_units, parseInt(props.match.params.id, 10)),
  wip: selectors.getWIP(state.content_units, 'fetchItem'),
  err: selectors.getError(state.content_units, 'fetchItem'),
  currentLanguage: system.getCurrentLanguage(state.system),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItem: actions.fetchItem }, dispatch);
}

export default connect(mapState, mapDispatch)(Container);
