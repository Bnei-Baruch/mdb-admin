import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button, Dropdown, Grid, Header, Icon, List, Modal, Segment
} from 'semantic-ui-react';

import { EMPTY_OBJECT, SECURITY_LEVELS } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/collections';
import * as shapes from '../../../shapes';

class DangerZoneTab extends Component {
  static propTypes = {
    changeSecurityLevel: PropTypes.func.isRequired,
    deleteC: PropTypes.func.isRequired,
    collection: shapes.Collection,
    status: shapes.AsyncStatusMap,
  };

  static defaultProps = {
    collection: null,
    status: EMPTY_OBJECT,
  };

  state = {
    changedSecure: null,
    modals: {
      confirmChangeSecurityLevel: false,
      confirmDelete: false,
    },
  };

  handleChangeSecure = (e, data) => {
    this.setState({
      changedSecure: data.value,
      modals: {
        ...this.state.modals,
        confirmChangeSecurityLevel: true
      }
    });
  };

  handleConfirmChangeSecure = () => {
    const { collection, changeSecurityLevel } = this.props;
    const level                               = this.state.changedSecure;
    changeSecurityLevel(collection.id, level);
    this.hideChangeSecurityLevelModal();
  };

  handleDelete = () => this.setState({
    modals: {
      ...this.state.modals,
      confirmDelete: true
    }
  });

  handleConfirmDelete = () => {
    const { collection, deleteC } = this.props;
    deleteC(collection.id);
    this.hideDeleteModal();
  };

  hideChangeSecurityLevelModal = () => {
    this.setState({
      changedSecure: null,
      modals: {
        ...this.state.modals,
        confirmChangeSecurityLevel: false,
      }
    });
  };

  hideDeleteModal = () => {
    this.setState({
      modals: {
        ...this.state.modals,
        confirmDelete: false,
      }
    });
  };

  render() {
    const { collection, status } = this.props;
    const options                = Object.keys(SECURITY_LEVELS)
      .map(k => SECURITY_LEVELS[k])
      .filter(x => x.value !== collection.secure);

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header attached inverted content="Danger Zone" color="red" />
            <Segment attached>
              <List divided relaxed="very" verticalAlign="middle">
                <List.Item>
                  <List.Content floated="right">
                    <Button.Group color="red">
                      <Dropdown
                        button
                        upward
                        options={options}
                        value={options[0].value}
                        onChange={this.handleChangeSecure}
                        selectOnBlur={false}
                      />
                    </Button.Group>
                  </List.Content>
                  <List.Content>
                    <List.Header>
                      Change Security Level
                    </List.Header>
                    Make sure you understand what you are doing.
                    {
                      status.changeSecurityLevel.err
                        ? (
                          <Header
                            content={formatError(status.changeSecurityLevel.err)}
                            icon={{ name: 'warning sign' }}
                            color="red"
                            size="tiny"
                          />
                        )
                        : null
                    }
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated="right">
                    {status.delete.wip ? <Icon name="spinner" loading /> : null}
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
                      status.delete.err
                        ? (
                          <Header
                            content={formatError(status.delete.err)}
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
              open={this.state.modals.confirmChangeSecurityLevel}
            >
              <Header icon="spy" content="Change Security Level" />
              <Modal.Content>
                <p>Are you sure you want to change the security level?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color="green" inverted onClick={this.hideChangeSecurityLevelModal}>
                  <Icon name="remove" /> No
                </Button>
                <Button color="red" inverted onClick={this.handleConfirmChangeSecure}>
                  <Icon name="checkmark" /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
            <Modal
              basic
              centered={false}
              size="small"
              open={this.state.modals.confirmDelete}
            >
              <Header icon="trash" content="Delete collection" />
              <Modal.Content>
                <p>Are you sure you want to permanently delete this collection?</p>
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

const mapState = (state) => {
  const status = ['changeSecurityLevel', 'delete']
    .reduce((acc, val) => {
      acc[val] = {
        wip: selectors.getWIP(state.collections, val),
        err: selectors.getError(state.collections, val),
      };
      return acc;
    }, {});

  return { status };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    changeSecurityLevel: actions.changeSecurityLevel,
    deleteC: actions.deleteC,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(DangerZoneTab);
