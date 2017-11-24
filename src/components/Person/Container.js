import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as shapes from '../shapes';
import { actions, selectors } from '../../redux/modules/persons';
import MainPage from './MainPage';

class Container extends Component {

  static propTypes = {
    match: shapes.RouterMatch.isRequired,
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
  person: selectors.getPersonById(state.persons, parseInt(props.match.params.id, 10)),
  wip: selectors.getWIP(state.persons, 'fetchItem'),
  err: selectors.getError(state.persons, 'fetchItem'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItem: actions.fetchItem }, dispatch);
}

export default connect(mapState, mapDispatch)(Container);
