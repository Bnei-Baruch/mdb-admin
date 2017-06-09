import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Dropdown, Grid, Header, Icon, List, Menu, Modal, Segment} from "semantic-ui-react";
import {SECURITY_LEVELS} from "../../helpers/consts";
import ContentUnitFiles from "./ContentUnitFiles";
import ContentUnitCollections from "./ContentUnitCollections";
import ContentUnitDetails from "./ContentUnitDetails";

class ContentUnitInfo extends Component {

    static propTypes = {
        changeSecurityLevel: PropTypes.func.isRequired,
        unit: PropTypes.object
    };

    static defaultProps = {
        unit: null,
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

    hideChangeSecurityLevelModal = () => {
        this.setState({
            changedSecurityLevel: null,
            modals: {
                ...this.state.modals,
                confirmChangeSecurityLevel: false,
            }
        });
    };

    onConfirmChangeSecurityLevel = () => {
        const level = this.state.changedSecurityLevel;
        this.props.changeSecurityLevel({id: this.props.unit.id, level});
        this.hideChangeSecurityLevelModal();
    };

    renderProperties() {
        const p = this.props.unit.properties;
        if (!p) {
            return null;
        }

        return <Grid.Row>
            <Grid.Column>
                <Header content="Extra properties"/>
                <pre>
                    {JSON.stringify(p, null, 2)}
                </pre>
            </Grid.Column>
        </Grid.Row>
    }

    renderDangerZone() {
        const options = Object.keys(SECURITY_LEVELS)
            .map(k => SECURITY_LEVELS[k])
            .filter(x => x.value !== this.props.unit.secure);

        return <Grid>

            <Grid.Row>
                <Grid.Column>
                    <Header attached inverted content="Danger Zone" color="red"/>
                    <Segment attached>
                        <List divided verticalAlign="middle">
                            <List.Item>
                                <List.Content floated="right">
                                    <Button.Group color="red">
                                        <Dropdown button upward
                                                  options={options}
                                                  defaultValue={options[0].value}
                                                  onChange={(e, {value}) => this.onChangeSecurityLevel(value)}
                                                  className="icon"/>
                                    </Button.Group>
                                </List.Content>
                                <List.Content>
                                    <List.Header>
                                        Change Security Level
                                    </List.Header>
                                    Make sure you understand what you're doing.
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Modal basic
                           size="small"
                           open={this.state.modals.confirmChangeSecurityLevel}>
                        <Header icon="spy" content="Change Security Level"/>
                        <Modal.Content>
                            <p>Are you sure you want to change the security level?</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color="green" inverted onClick={this.hideChangeSecurityLevelModal}>
                                <Icon name="remove"/> No
                            </Button>
                            <Button color="red" inverted onClick={this.onConfirmChangeSecurityLevel}>
                                <Icon name="checkmark"/> Yes
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    }

    render() {
        const unit = this.props.unit;
        if (!unit) {
            return null;
        }

        return <div>
            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header content="Content Unit Info" color="blue"/>
                </Menu.Item>
            </Menu>

            <Segment attached>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <ContentUnitDetails unit={this.props.unit}></ContentUnitDetails>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <ContentUnitFiles id={this.props.unit.id} />
                            <ContentUnitCollections id={this.props.unit.id} />
                        </Grid.Column>
                    </Grid.Row>
                    {this.renderProperties()}
                </Grid>
            </Segment>
            <br/>
            {this.renderDangerZone()}
        </div>;
    }
}

export default ContentUnitInfo;

