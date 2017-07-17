import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Dropdown, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';

import { SECURITY_LEVELS } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';

class DangerZoneTab extends Component {

  static propTypes = {
    changeSecurityLevel: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
    err: shapes.Error,
  };

  static defaultProps = {
    unit: null,
    err: null,
  };

  state = {
    changedSecure: null,
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
    const { unit, changeSecurityLevel } = this.props;
    const level                         = this.state.changedSecure;
    changeSecurityLevel(unit.id, level);
    this.hideChangeSecurityLevelModal();
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
    const { unit, err } = this.props;

    const options = Object.keys(SECURITY_LEVELS)
      .map(k => SECURITY_LEVELS[k])
      .filter(x => x.value !== unit.secure);

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

const mapState = state => ({
  err: selectors.getError(state.content_units, 'changeSecurityLevel'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ changeSecurityLevel: actions.changeSecurityLevel }, dispatch);
}

export default connect(mapState, mapDispatch)(DangerZoneTab);
