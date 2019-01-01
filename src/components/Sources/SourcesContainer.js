import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/sources';
import { selectors as authors } from '../../redux/modules/authors';
import { selectors as system } from '../../redux/modules/system';
import SourcesHierarchy from './SourcesHierarchy';

class SourcesContainer extends Component {
  static propTypes = {
    fetchAll: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchAll();
  }

  render() {
    return <SourcesHierarchy {...this.props} />;
  }
}

const mapState = state => ({
  getSourceById: selectors.getSourceById(state.sources),
  hierarchy: selectors.getHierarchy(state.sources),
  getWIP: selectors.getWIP(state.sources),
  getError: selectors.getError(state.sources),
  authors: authors.getAuthorsList(state.authors),
  currentLanguage: system.getCurrentLanguage(state.system),
});

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(SourcesContainer);
