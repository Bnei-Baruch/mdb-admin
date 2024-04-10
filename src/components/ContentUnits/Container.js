import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CONTENT_TYPE_BY_ID, CT_SOURCE, EMPTY_ARRAY, EMPTY_OBJECT, NS_UNITS } from '../../helpers/consts';
import { actions as unitActions, selectors as units } from '../../redux/modules/content_units';

import { actions, selectors } from '../../redux/modules/lists';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as system } from '../../redux/modules/system';
import * as shapes from '../shapes';
import MainPage from './MainPage';
import { selectors as filterSelectors } from '../../redux/modules/filters';

class ContentUnitsContainer extends Component {
  static propTypes = {
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    fetchList  : PropTypes.func.isRequired,
  };

  static defaultProps = {
    wipOfCreate: false,
    errOfCreate: null
  };

  // on main page we show additional data (collections),
  // so need fetch units on mount even we are here before and filters was hydrated
  componentDidMount() {
    if (this.props.isHydrated)
      this.askForData(this.getPageNo());
  }

  componentDidUpdate(prevProps) {
    const { wipOfCreate: pWip, errOfCreate: pErr } = prevProps;
    const { wipOfCreate: nWip, errOfCreate: nErr } = this.props;

    if ((pWip || pErr) && !nWip && !nErr) {
      this.askForData(this.getPageNo());
    }
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      const match = search.match(/page=(\d+)/);
      if (match) {
        page = parseInt(match[1], 10);
      }
    }

    return (Number.isNaN(page) || page <= 0) ? 1 : page;
  };

  askForData = pageNo =>
    this.props.fetchList(NS_UNITS, pageNo);

  render() {
    return (
      <MainPage
        {...this.props}
        getPageNo={this.getPageNo}
      />
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_UNITS) || EMPTY_OBJECT;
  const sByUid    = sourcesSelectors.getSourceByUID(state.sources);
  const denormIDs = units.denormIDs(state.content_units);

  let items = EMPTY_ARRAY;
  if (Array.isArray(status.items)
    && status.items.length > 0) {
    items = denormIDs(status.items).map(x => {
      if (CONTENT_TYPE_BY_ID[x.type_id] !== CT_SOURCE || !x.properties) return x;
      const { source_id } = x.properties;
      if (!source_id) return x;
      const s = sByUid(source_id);
      if (!s) return x;
      return { ...x, i18n: s.i18n };
    });
  }

  return {
    ...status,
    wipOfCreate    : units.getWIP(state.content_units, 'create'),
    errOfCreate    : units.getError(state.content_units, 'create'),
    lastCreated    : units.getLastCreated(state.content_units),
    items,
    currentLanguage: system.getCurrentLanguage(state.system),
    isHydrated     : filterSelectors.getIsHydrated(state.filters, NS_UNITS)
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage  : actions.setPage,
    create   : unitActions.create,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(ContentUnitsContainer);
