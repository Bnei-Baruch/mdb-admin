import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/lists';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { actions as unitActions, selectors as units } from '../../redux/modules/content_units';
import { selectors as system } from '../../redux/modules/system';
import { CONTENT_TYPE_BY_ID, CT_SOURCE, EMPTY_ARRAY, EMPTY_OBJECT, NS_UNITS } from '../../helpers/consts';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class ContentUnitsContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    fetchList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    wipOfCreate: false,
    errOfCreate: null
  };

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
    const { location, ...rest } = this.props;
    return (<MainPage {...rest} getPageNo={this.getPageNo} />);
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_UNITS) || EMPTY_OBJECT;
  const sById     = sourcesSelectors.getSourceById(state.sources);
  const denormIDs = units.denormIDs(state.content_units);

  let items = EMPTY_ARRAY;
  if (Array.isArray(status.items)
    && status.items.length > 0) {
    items = denormIDs(status.items).map(x => {
      if (CONTENT_TYPE_BY_ID[x.type_id] !== CT_SOURCE || !x.properties) return x;
      const { source_id } = x.properties;
      if (!source_id) return x;
      const { i18n } = sById(source_id);
      return { ...x, i18n };
    });
  }

  return {
    ...status,
    wipOfCreate: units.getWIP(state.content_units, 'create'),
    errOfCreate: units.getError(state.content_units, 'create'),
    items,
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    create: unitActions.create,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(ContentUnitsContainer);
