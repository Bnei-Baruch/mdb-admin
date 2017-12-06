import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/content_units';
import { selectors as files } from '../../../../redux/modules/files';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import FilesHierarchy from './FilesHierarchy';

class FilesTab extends Component {

  static propTypes = {
    fetchItemFiles: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: undefined,
  };

  componentDidMount() {
    const { unit } = this.props;
    if (unit) {
      this.askForData(unit.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (((nextProps.unit && !this.props.unit) ||
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
    wip: selectors.getWIP(state.content_units, 'fetchItemFiles'),
    err: selectors.getError(state.content_units, 'fetchItemFiles'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItemFiles: actions.fetchItemFiles }, dispatch);
}

export default connect(mapState, mapDispatch)(FilesTab);

