import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY } from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/content_units';
import { selectors as filesSectors } from '../../../../redux/modules/files';

import * as shapes from '../../../shapes';

import Files from './List';
import AddFiles from './selectNew/Container';

class AssociationsTab extends Component {

  static propTypes = {
    fetchItemFiles: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: null,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.unit && !this.props.unit) {
      this.askForData(nextProps.unit.id);
    }
  }

  askForData = (id) => this.props.fetchItemFiles(id);

  setEditMode = editMode => this.setState({ editMode });

  render() {
    if (this.state.editMode) {
      return (<AddFiles {...this.props} setEditMode={this.setEditMode} />);
    }
    return (<Files {...this.props} setEditMode={this.setEditMode} />);
  }

}

const mapState = (state, ownProps) => {
  const { unit } = ownProps;

  const denormFiles = filesSectors.denormIDs(state.files);
  const filesIds    = unit && unit.files ? unit.files : EMPTY_ARRAY;
  return {
    files: denormFiles(filesIds),
    wip: selectors.getWIP(state.content_units, 'fetchItemFiles'),
    err: selectors.getError(state.content_units, 'fetchItemFiles'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItemFiles: actions.fetchItemFiles,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsTab);
