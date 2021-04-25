import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/content_units';
import { selectors as system } from '../../redux/modules/system';
import * as shapes from '../shapes';
import MainPage from './MainPage';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { CONTENT_TYPE_BY_ID, CT_SOURCE } from '../../helpers/consts';

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

const mapState = (state, props) => {
  let unit = selectors.getContentUnitById(state.content_units, parseInt(props.match.params.id, 10));
  if (CONTENT_TYPE_BY_ID[unit.type_id] === CT_SOURCE && unit.properties && unit.properties.source_id) {
    const { i18n } = sourcesSelectors.getSourceByUID(state.sources)(unit.properties.source_id);
    unit           = { ...unit, i18n };
  }
  return {
    unit,
    wip: selectors.getWIP(state.content_units, 'fetchItem'),
    err: selectors.getError(state.content_units, 'fetchItem'),
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItem: actions.fetchItem }, dispatch);
}

export default connect(mapState, mapDispatch)(Container);
