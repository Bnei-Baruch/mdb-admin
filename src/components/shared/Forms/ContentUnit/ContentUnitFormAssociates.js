import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Divider, Grid, Modal, Segment } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/content_units';
import DerivativesContainer from '../../../ContentUnit/tabs/associations/DerivativesContainer';
import OriginsContainer from '../../../ContentUnit/tabs/associations/OriginsContainer';
import Persons from '../../../ContentUnit/tabs/associations/Persons';
import Tags from '../../../ContentUnit/tabs/associations/Tags';

class ContentUnitFormAssociates extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true };
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    const { unit } = this.props;
    if (unit) {
      this.askForData(unit.id);
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

  close() {
    this.setState({ isOpen: false });
    this.props.onClose();
  }

  renderGrid() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <DerivativesContainer {...this.props} />
            <Divider horizontal hidden />
            <OriginsContainer {...this.props} />
          </Grid.Column>
          <Grid.Column width={8}>
            <Tags {...this.props} />
            <Divider horizontal hidden />
            <Persons {...this.props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    const { isOpen } = this.state;
    return (
      <Modal
        closeIcon
        centered={false}
        size="large"
        open={isOpen}
        onClose={this.close}
      >
        <Modal.Header>Associate Content Unit</Modal.Header>
        <Modal.Content>
          <Segment.Group>
            <Segment basic>
              {this.renderGrid()}
            </Segment>

            <Segment clearing attached="bottom" size="tiny">
              <Button
                primary
                content="Close"
                size="tiny"
                floated="right"
                onClick={this.close}
              />
            </Segment>
          </Segment.Group>
        </Modal.Content>
      </Modal>
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

export default connect(null, mapDispatch)(ContentUnitFormAssociates);
