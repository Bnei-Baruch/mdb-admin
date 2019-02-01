import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../redux/modules/operations';
import * as shapes from '../shapes';
import MainPage from './MainPage';

class FileContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    fetchItem: PropTypes.func.isRequired,
    fetchItemFiles: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.askForData(id);
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } } } = this.props;
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
    this.props.fetchItemFiles(x);
  }

  render() {
    return <MainPage {...this.props} />;
  }
}

const mapState = (state, props) => ({
  operation: selectors.getOperationById(state.operations, parseInt(props.match.params.id, 10)),
  wip: selectors.getWIP(state.operations, 'fetchItem'),
  err: selectors.getError(state.operations, 'fetchItem'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItem: actions.fetchItem,
    fetchItemFiles: actions.fetchItemFiles,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FileContainer);
