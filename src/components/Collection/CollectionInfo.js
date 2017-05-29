import React, {Component} from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {Link} from "react-router-dom";
import {Button, Dropdown, Grid, Header, Icon, List, Menu, Modal, Segment} from "semantic-ui-react";
import {CONTENT_TYPE_BY_ID, SECURITY_LEVELS} from "../../helpers/consts";

class CollectionInfo extends Component {

    static propTypes = {
        changeSecurityLevel: PropTypes.func.isRequired,
        collection: PropTypes.object
    };

    static defaultProps = {
        collection: null,
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
        this.props.changeSecurityLevel({id: this.props.collection.id, level});
        this.hideChangeSecurityLevelModal();
    };

    renderProperties() {
        const p = this.props.collection.properties;
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
            .filter(x => x.value !== this.props.collection.secure);

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
        const collection = this.props.collection;
        if (!collection) {
            return null;
        }

        return <div>
            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header content="Collection Info" color="blue"/>
                </Menu.Item>
            </Menu>

            <Segment attached>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header content="Details" />
                            <List divided relaxed>
                                <List.Item>
                                    <strong>ID</strong>
                                    <List.Content floated="right">
                                        {collection.id}
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <strong>UID</strong>
                                    <List.Content floated="right">
                                        {collection.uid}
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <strong>DB created_at</strong>
                                    <List.Content floated="right">
                                        {moment.utc(collection.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <strong>Type</strong>
                                    <List.Content floated="right">
                                        {CONTENT_TYPE_BY_ID[collection.type_id]}
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <strong>Secure</strong>
                                    <List.Content floated="right">
                                        <Header size="tiny"
                                                content={SECURITY_LEVELS[collection.secure].text}
                                                color={SECURITY_LEVELS[collection.secure].color}/>

                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <strong>Published</strong>
                                    <List.Content floated="right">
                                        {
                                            collection.published ?
                                                <Icon name="checkmark" color="green"/> :
                                                <Icon name="ban" color="red"/>
                                        }
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header content="Content Units" />
                            <List>
                                {
                                    (collection.content_units || []).map(({name, content_unit}) =>
                                    <List.Item>
                                        <Link to={`/content_units/${content_unit.id}`}>{name}</Link>
                                    </List.Item>
                                    )
                                }
                            </List>
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

export default CollectionInfo;

