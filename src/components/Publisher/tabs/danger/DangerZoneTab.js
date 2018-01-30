import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';

import { formatError } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/publishers';
import * as shapes from '../../../shapes';

class DangerZoneTab extends Component {

  static propTypes = {
    publisher: shapes.Publisher,
    err: shapes.Error,
  };

  static defaultProps = {
    publisher: null,
    err: null,
  };

  state = {
    deletePublisher: null,
    confirmDelete: false,
  };

  handleDelete = () => this.setState({ confirmDelete: true });

  handleConfirmDelete = () => {
    const { publisher, deletePublisher } = this.props;
    deletePublisher(publisher.id);
    this.setState({ confirmDelete: false });
  };

  render() {
    const { wip, err } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header attached inverted content="Danger Zone" color="red" />
            <Segment attached>
              <List divided verticalAlign="middle">
                <List.Item>
                  <List.Content floated="right">
                    {
                      wip ?
                        <Icon name="spinner" loading /> :
                        null
                    }
                    <Button
                      color="red"
                      content="Delete"
                      onClick={this.handleDelete}
                    />
                  </List.Content>
                  <List.Content>
                    <List.Header>
                      Delete Permanently
                    </List.Header>
                    BE CAREFUL, there is no going back !
                    {
                      err ?
                        <Header
                          content={formatError(err)}
                          icon={{ name: 'warning sign' }}
                          color="red"
                          size="tiny"
                        /> :
                        null
                    }
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
            <Modal
              basic
              size="small"
              open={this.state.confirmDelete}
            >
              <Header icon="trash" content="Delete publisher" />
              <Modal.Content>
                <p>Are you sure you want to permanently delete this publisher?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color="green" inverted onClick={this.hideDeleteModal}>
                  <Icon name="remove" /> No
                </Button>
                <Button color="red" inverted onClick={this.handleConfirmDelete}>
                  <Icon name="checkmark" /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapState = state => ({
  err: selectors.getError(state.publishers, 'delete'),
  wip: selectors.getWIP(state.publishers, 'delete'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    deletePublisher: actions.deletePublisher
  }, dispatch);
}

export default connect(mapState, mapDispatch)(DangerZoneTab);
