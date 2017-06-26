import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as shapes from '../shapes';
import { actions, selectors } from '../../redux/modules/content_units';
import { selectors as files } from '../../redux/modules/files';
import { selectors as collections } from '../../redux/modules/collections';
import { selectors as sources } from '../../redux/modules/sources';
import { selectors as tags } from '../../redux/modules/tags';
import { selectors as authors } from '../../redux/modules/authors';

import MainPage from './MainPage';

class Container extends Component {

  static propTypes = {
    match    : shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    this.askForData(id);
  }

  componentWillReceiveProps(nextProps) {
    const id  = this.props.match.params.id;
    const nId = nextProps.match.params.id;
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
  unit                   : selectors.getContentUnitById(state.content_units)(parseInt(props.match.params.id, 10)),
  getWIP                 : selectors.getWIP(state.content_units),
  getError               : selectors.getError(state.content_units),
  getFileById            : files.getFileById(state.files),
  getCollectionById      : collections.getCollectionById(state.collections),
  getSourceById          : sources.getSourceById(state.sources),
  getTagById             : tags.getTagById(state.tags),
  getAuthorByCollectionId: authors.getAuthorByCollectionId(state.authors),
});

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(Container);