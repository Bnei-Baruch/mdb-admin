import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Dropdown, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';

import { EMPTY_OBJECT, SECURITY_LEVELS, CONTENT_UNIT_TYPES, CT_SOURCE, CT_UNKNOWN } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';

const CT_HIDE_FOR_CHANGE = [CT_SOURCE, CT_UNKNOWN];

const options   = Object.keys(SECURITY_LEVELS).map(k => SECURITY_LEVELS[k]);
const ctOptions = Object.keys(CONTENT_UNIT_TYPES)
  .filter(k => !CT_HIDE_FOR_CHANGE.some(x => x === k))
  .map(k => CONTENT_UNIT_TYPES[k]);

class DangerZoneTab extends Component {
  static propTypes = {
    changeSecurityLevel: PropTypes.func.isRequired,
    changeCT: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
    err: shapes.Error,
  };

  static defaultProps = {
    unit: null,
    err: null,
    user: EMPTY_OBJECT
  };

  state = {
    changedSecure: null,
    modals: {
      confirmChangeSecurityLevel: false,
      confirmChangeCT: false,
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

  handleChangeCT = (e, data) => {
    this.setState({
      changedCT: data.value,
      modals: {
        ...this.state.modals,
        confirmChangeCT: true
      }
    });
  };

  handleConfirmChangeCT = () => {
    const { unit, changeCT } = this.props;
    const ct                 = this.state.changedCT;
    changeCT(unit.id, ct);
    this.hideChangeCTModal();
  };

  hideChangeCTModal = () => {
    this.setState({
      changedCT: null,
      modals: {
        ...this.state.modals,
        confirmChangeCT: false,
      }
    });
  };

  renderChangeSecure = () => {
    const { unit: { secure }, err } = this.props;

    return (
      <List.Item>
        <List.Content floated="right">
          <Button.Group color="red">
            <Dropdown
              button
              upward
              options={options}
              value={secure}
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
      </List.Item>
    );
  };

  renderChangeCT = () => {
    const { unit: { type_id }, errCT } = this.props;
    if (type_id === CONTENT_UNIT_TYPES[CT_SOURCE].value) return null;
    return (
      <List.Item>
        <List.Content floated="right">
          <Button.Group color="red">
            <Dropdown
              button
              options={ctOptions}
              value={type_id}
              onChange={this.handleChangeCT}
              selectOnBlur={false}
            />
          </Button.Group>
        </List.Content>
        <List.Content>
          <List.Header>
            Change Content Type
          </List.Header>
          Make sure you understand what you are doing.
          {
            errCT
              ? (
                <Header
                  content={formatError(errCT)}
                  icon={{ name: 'warning sign' }}
                  color="red"
                  size="tiny"
                />
              )
              : null
          }
        </List.Content>
        <Modal
          basic
          centered={false}
          size="small"
          open={this.state.modals.confirmChangeCT}
        >
          <Header icon="spy" content="Change Unit Content type" />
          <Modal.Content>
            <p>Are you sure you want to change the unit content type?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="green" inverted onClick={this.hideChangeCTModal}>
              <Icon name="remove" /> No
            </Button>
            <Button color="red" inverted onClick={this.handleConfirmChangeCT}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </List.Item>
    );
  };

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header attached inverted content="Danger Zone" color="red" />
            <Segment attached>
              <List divided verticalAlign="middle">
                {this.renderChangeSecure()}
                {this.renderChangeCT()}
              </List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapState = state => ({
  err: selectors.getError(state.content_units, 'changeSecurityLevel'),
  errCT: selectors.getError(state.content_units, 'changeCT'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    changeSecurityLevel: actions.changeSecurityLevel,
    changeCT: actions.changeCT
  }, dispatch);
}

export default connect(mapState, mapDispatch)(DangerZoneTab);
