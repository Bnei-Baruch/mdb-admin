import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/content_units';
import { selectors as files } from '../../../../redux/modules/files';
import * as shapes from '../../../shapes';
import FilesHierarchy from './FilesHierarchy';
import AddNewFiles from './AddNewFiles';

class FilesTab extends Component {
  static propTypes = {
    fetchItemFiles: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: undefined,
  };

  state = {
    editMode: false
  };

  componentDidMount() {
    const { unit } = this.props;
    if (unit) {
      this.askForData(unit.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (((!prevProps.unit && this.props.unit)
      || (prevProps.unit && this.props.unit && prevProps.unit.id !== this.props.unit.id))) {
      this.askForData(this.props.unit.id);
    }
  }

  askForData = id => this.props.fetchItemFiles(id);

  setEditMode = editMode => this.setState({ editMode });

  render() {
    if (this.state.editMode) {
      return (
        <AddNewFiles
          unit={this.props.unit}
          setEditMode={this.setEditMode}
        />
      );
    }

    return (
      <FilesHierarchy
        {...this.props}
        setEditMode={this.setEditMode}
      />
    );
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
