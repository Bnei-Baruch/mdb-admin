import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Checkbox, Dropdown, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';

import { EMPTY_OBJECT, SECURITY_LEVELS } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/collections';
import * as shapes from '../../../shapes';

class DangerZoneTab extends Component {

  static propTypes = {
    changeSecurityLevel: PropTypes.func.isRequired,
    changeActive: PropTypes.func.isRequired,
    collection: shapes.Collection,
    status: shapes.AsyncStatusMap,
  };

  static defaultProps = {
    collection: null,
    status: EMPTY_OBJECT,
  };

  state = {
    changedSecure: null,
    changedActive: null,
    modals: {
      confirmChangeSecurityLevel: false,
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

  handleChangeActive = () => {
    const { collection, changeActive } = this.props;
    changeActive(collection.id);
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

  render() {
    const { collection, status } = this.props;
    const properties             = collection.properties || {};
    const isActive               = Object.prototype.hasOwnProperty.call(properties, 'active') ? properties.active : true;
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
                      />
                    </Button.Group>
                  </List.Content>
                  <List.Content>
                    <List.Header>
                      Change Security Level
                    </List.Header>
                    Make sure you understand what you are doing.
                    {
                      status.changeSecurityLevel.err ?
                        <Header
                          content={formatError(status.changeSecurityLevel.err)}
                          icon={{ name: 'warning sign' }}
                          color="red"
                          size="tiny"
                        /> :
                        null
                    }
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated="right">
                    {
                      status.changeActive.wip ?
                        <Icon name="spinner" loading /> :
                        null
                    }
                    <Checkbox
                      toggle
                      checked={isActive}
                      label={isActive ? 'active' : 'inactive'}
                      onClick={this.handleChangeActive}
                    />
                  </List.Content>
                  <List.Content>
                    <List.Header>
                      Change Active Mode
                    </List.Header>
                    Active collections are available for selection in BB studio, rename tool.
                    {
                      status.changeActive.err ?
                        <Header
                          content={formatError(status.changeActive.err)}
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapState = (state) => {
  const status = ['changeSecurityLevel', 'changeActive']
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
    changeActive: actions.changeActive,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(DangerZoneTab);
