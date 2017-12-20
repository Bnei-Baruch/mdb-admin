import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';

import { EMPTY_ARRAY } from '../../../../helpers/consts';
import { selectors as operations } from '../../../../redux/modules/operations';
import { actions, selectors } from '../../../../redux/modules/files';
import FilesHierarchy from './FilesHierarchy';

class OperationsTab extends Component {

  static propTypes = {
    fetchTreeWithOperations: PropTypes.func.isRequired,
    file: PropTypes.object,
  };

  static defaultProps = {
    file: undefined,
  };

  componentDidMount() {
    const { file } = this.props;
    if (file) {
      this.props.fetchTreeWithOperations(file.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (((nextProps.file && !nextProps.file) ||
        (nextProps.file && this.props.file && nextProps.file.id !== this.props.file.id))) {
      this.props.fetchTreeWithOperations(nextProps.file.id);
    }
  }

  render() {
    return <FilesHierarchy {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { file } = ownProps;

  const fileIds   = file ? file.tree : EMPTY_ARRAY;
  const denormIDs = selectors.denormIDs(state.files);
  const files     = fileIds ? denormIDs(fileIds) : EMPTY_ARRAY;

  const denormOperationsIDs = operations.denormIDs(state.operations);
  const operationsIds       = uniq(files.reduce((result, f) => result.concat(f.operations), []));
  return {
    files,
    operations: operationsIds ? denormOperationsIDs(operationsIds) : [],
    wip: selectors.getWIP(state.files, 'fetchTreeWithOperations'),
    err: selectors.getError(state.files, 'fetchTreeWithOperations'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchTreeWithOperations: actions.fetchTreeWithOperations
  }, dispatch);
}

export default connect(mapState, mapDispatch)(OperationsTab);
