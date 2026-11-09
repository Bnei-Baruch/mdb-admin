import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';

import { formatError } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/labels';
import * as shapes from '../../../shapes';

class DangerZoneTab extends Component {
  static propTypes = {
    label: PropTypes.object,
    wip: PropTypes.bool,
    err: shapes.Error,
    deleteLabel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    label: null,
    wip: false,
    err: null,
  };

  state = {
    confirmDelete: false,
  };

  handleDelete = () => this.setState({ confirmDelete: true });

  handleConfirmDelete = () => {
    const { label, deleteLabel } = this.props;
    deleteLabel(label.id);
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
                      wip ? <Icon name="spinner" loading /> : null
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
                      err
                        ? (
                          <Header
                            content={formatError(err)}
                            icon={{ name: 'warning sign' }}
                            color="red"
                            size="tiny"
                          />
                        )
                        : null
                    }
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
            <Modal
              basic
              centered={false}
              size="small"
              open={this.state.confirmDelete}
            >
              <Header icon="trash" content="Delete label" />
              <Modal.Content>
                <p>Are you sure you want to permanently delete this label?</p>
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
  err: selectors.getError(state.labels, 'delete'),
  wip: selectors.getWIP(state.labels, 'delete'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    deleteLabel: actions.deleteLabel
  }, dispatch);
}

export default connect(mapState, mapDispatch)(DangerZoneTab);
