import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Divider, Grid } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';
import Collections from './Collections';
import Derivatives from './Derivatives';
import Origins from './Origins';
import Sources from './Sources';
import Tags from './Tags';

class AssociationsTab extends Component {

  static propTypes = {
    fetchItemCollections: PropTypes.func.isRequired,
    fetchItemDerivatives: PropTypes.func.isRequired,
    fetchItemOrigins: PropTypes.func.isRequired,
    fetchItemSources: PropTypes.func.isRequired,
    fetchItemTags: PropTypes.func.isRequired,
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
    if (((nextProps.unit && !this.props.unit) ||
        (nextProps.unit && this.props.unit && nextProps.unit.id !== this.props.unit.id))) {
      this.askForData(nextProps.unit.id);
    }
  }

  askForData(id) {
    this.props.fetchItemCollections(id);
    this.props.fetchItemDerivatives(id);
    this.props.fetchItemOrigins(id);
    this.props.fetchItemSources(id);
    this.props.fetchItemTags(id);
  }

  render() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Collections {...this.props} />
            <Divider horizontal hidden />
            <Derivatives {...this.props} />
            <Divider horizontal hidden />
            <Origins {...this.props} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Sources {...this.props} />
            <Divider horizontal hidden />
            <Tags {...this.props} />
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
  }, dispatch);
}

export default connect(null, mapDispatch)(AssociationsTab);
