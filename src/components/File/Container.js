import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/files';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class FileContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
    fetchItemStorages: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.askForData(id);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id } } } = prevProps;
    const nId = this.props.match.params.id;
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
    this.props.fetchItemStorages(x);
  }

  render() {
    return <MainPage {...this.props} />;
  }
}

const mapState = (state, props) => ({
  file: selectors.getFileById(state.files, parseInt(props.match.params.id, 10)),
  wip: selectors.getWIP(state.files, 'fetchItem'),
  err: selectors.getError(state.files, 'fetchItem'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItem: actions.fetchItem,
    fetchItemStorages: actions.fetchItemStorages,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FileContainer);
