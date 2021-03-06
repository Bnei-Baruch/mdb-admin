import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Divider, Grid } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';
import Collections from './Collections';
import DerivativesContainer from './DerivativesContainer';
import OriginsContainer from './OriginsContainer';
import Sources from './Sources';
import Tags from './Tags';
import Persons from './Persons';

class AssociationsTab extends Component {
  static propTypes = {
    fetchItemCollections: PropTypes.func.isRequired,
    fetchItemDerivatives: PropTypes.func.isRequired,
    fetchItemOrigins: PropTypes.func.isRequired,
    fetchItemSources: PropTypes.func.isRequired,
    fetchItemTags: PropTypes.func.isRequired,
    fetchItemPersons: PropTypes.func.isRequired,
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

  componentDidUpdate(prevProps) {
    if (((this.props.unit && !prevProps.unit)
        || (this.props.unit && prevProps.unit && this.props.unit.id !== prevProps.unit.id))) {
      this.askForData(this.props.unit.id);
    }
  }

  askForData(id) {
    this.props.fetchItemCollections(id);
    this.props.fetchItemDerivatives(id);
    this.props.fetchItemOrigins(id);
    this.props.fetchItemSources(id);
    this.props.fetchItemTags(id);
    this.props.fetchItemPersons(id);
  }

  render() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Collections {...this.props} />
            <Divider horizontal hidden />
            <DerivativesContainer {...this.props} />
            <Divider horizontal hidden />
            <OriginsContainer {...this.props} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Sources {...this.props} />
            <Divider horizontal hidden />
            <Tags {...this.props} />
            <Divider horizontal hidden />
            <Persons {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItemCollections: actions.fetchItemCollections,
    fetchItemDerivatives: actions.fetchItemDerivatives,
    fetchItemOrigins: actions.fetchItemOrigins,
    fetchItemSources: actions.fetchItemSources,
    fetchItemTags: actions.fetchItemTags,
    fetchItemPersons: actions.fetchItemPersons,
  }, dispatch);
}

export default connect(null, mapDispatch)(AssociationsTab);
