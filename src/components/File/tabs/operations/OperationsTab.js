import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/operations';
import { selectors as files } from '../../../../redux/modules/files';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import FilesHierarchy from './FilesHierarchy';

class OperationsTab extends Component {

  static propTypes = {
    fetchItemFiles: PropTypes.func.isRequired,
    operation: shapes.Operation,
  };

  static defaultProps = {
    operation: undefined,
  };

  componentDidMount() {
    const { operation } = this.props;
    if (operation) {
      this.askForData(operation.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (((nextProps.unit && !this.props.operation) ||
        (nextProps.unit && this.props.unit && nextProps.unit.id !== this.props.unit.id))) {
      this.askForData(nextProps.unit.id);
    }
  }

  askForData(id) {
    this.props.fetchItemFiles(id);
  }

  render() {
    return <FilesHierarchy {...this.props} />;
  }
}

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT } = ownProps;
  const fileIds                 = unit.files;
  const denormIDs               = files.denormIDs(state.files);
  return {
    files: fileIds ? denormIDs(fileIds) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.opertions, 'fetchItemFiles'),
    err: selectors.getError(state.opertions, 'fetchItemFiles'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItemFiles: actions.fetchItemFiles }, dispatch);
}

export default connect(mapState, mapDispatch)(OperationsTab);

