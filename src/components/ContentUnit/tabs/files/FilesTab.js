import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as shapes from '../../../shapes';
import Files from './Files';

class FilesTab extends Component {

  static propTypes = {
    fetchItemFiles: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: null,
  };

  componentDidMount() {
    const { unit } = this.props;
    if (unit) {
      this.askForData(unit.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unit && !this.props.unit && nextProps.unit.id !== this.props.unit.id) {
      this.askForData(nextProps.unit.id);
    }
  }

  askForData(id) {
    this.props.fetchItemFiles(id);
  }

  render() {
    return <Files {...this.props} />;
  }
}

export default FilesTab;

