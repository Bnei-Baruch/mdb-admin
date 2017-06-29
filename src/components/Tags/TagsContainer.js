import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions, selectors } from '../../redux/modules/tags';
import TagsHierarchy from './TagsHierarchy';

class TagsContainer extends Component {

  static propTypes = {
    fetchAll: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchAll();
  }

  render() {
    return <TagsHierarchy {...this.props} />;
  }
}

const mapState = state => ({
  getTagById: selectors.getTagById(state.tags),
  hierarchy: selectors.getHierarchy(state.tags),
  getWIP: selectors.getWIP(state.tags),
  getError: selectors.getError(state.tags),
});

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(TagsContainer);
