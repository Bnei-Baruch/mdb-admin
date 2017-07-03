import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Dropdown, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';

import { actions, selectors } from '../../../../redux/modules/files';
import * as shapes from '../../../shapes';
import { SECURITY_LEVELS } from '../../../../helpers/consts';

class DangerZoneTab extends Component {

  static propTypes = {
    changeSecurityLevel: PropTypes.func.isRequired,
    file: shapes.File,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    file: null,
    wip: false,
    err: null,
  };

  state = {
    changedSecurityLevel: null,
    modals: {
      confirmChangeSecurityLevel: false,
    },
  };

  onChangeSecurityLevel = (value) => {
    this.setState({
      changedSecurityLevel: value,
      modals: {
        ...this.state.modals,
        confirmChangeSecurityLevel: true
      }
    });
  };

  onConfirmChangeSecurityLevel = () => {
    const level = this.state.changedSecurityLevel;
    this.props.changeSecurityLevel({ id: this.props.file.id, level });
    this.hideChangeSecurityLevelModal();
  };

  hideChangeSecurityLevelModal = () => {
    this.setState({
      changedSecurityLevel: null,
      modals: {
        ...this.state.modals,
        confirmChangeSecurityLevel: false,
      }
    });
  };

  render() {
    const options = Object.keys(SECURITY_LEVELS)
      .map(k => SECURITY_LEVELS[k])
      .filter(x => x.value !== this.props.file.secure);

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header attached inverted content="Danger Zone" color="red" />
            <Segment attached>
              <List divided verticalAlign="middle">
                <List.Item>
                  <List.Content floated="right">
                    <Button.Group color="red">
                      <Dropdown
                        button
                        upward
                        options={options}
                        value={options[0].value}
                        onChange={(e, { value }) => this.onChangeSecurityLevel(value)}
                      />
                    </Button.Group>
                  </List.Content>
                  <List.Content>
                    <List.Header>
                      Change Security Level
                    </List.Header>
                    Make sure you understand what you are doing.
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
                <Button color="red" inverted onClick={this.onConfirmChangeSecurityLevel}>
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
  wip: selectors.getWIP(state.collections, 'changeSecurityLevel'),
  err: selectors.getError(state.collections, 'changeSecurityLevel'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ changeSecurityLevel: actions.changeSecurityLevel }, dispatch);
}

export default connect(mapState, mapDispatch)(DangerZoneTab);
