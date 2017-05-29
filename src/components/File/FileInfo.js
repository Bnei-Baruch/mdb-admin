import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import moment from "moment";
import filesize from "filesize";
import {Button, Dropdown, Flag, Grid, Header, Icon, List, Menu, Modal, Segment} from "semantic-ui-react";
import Player from "../Player/JWPlayer";
import {fileIcon, fileTypes} from "../../helpers/utils";
import {LANGUAGES, SECURITY_LEVELS} from "../../helpers/consts";

class FileInfo extends Component {

    static propTypes = {
        changeSecurityLevel: PropTypes.func.isRequired,
        file: PropTypes.object
    };

    static defaultProps = {
        file: null,
    };

    state = {
        changedSecurityLevel: null,
        modals: {
            confirmChangeSecurityLevel: false,
        },
    };

    onDownload() {
        const file = this.props.file,
            url = `http://files.bbdomain.org/get/${file.sha1}/${file.name}`;
        window.open(url, '_blank');
    }

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
        this.props.changeSecurityLevel({id: this.props.file.id, level});
        this.hideChangeSecurityLevelModal();
    };

    renderProperties() {
        const p = this.props.file.properties;
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
            .filter(x => x.value !== this.props.file.secure);

        return <Grid.Row centered>
            <Grid.Column width={8}>
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
    }

    render() {
        const file = this.props.file;
        if (!file) {
            return null;
        }

        const language = LANGUAGES[file.language] || {text: "none"},
            icon = fileIcon(file),
            types = fileTypes(file);

        return <div>
            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header icon={icon} content={file.name} color="blue"/>
                </Menu.Item>
            </Menu>

            <Segment attached>
                <Grid stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column width={10}>
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={14}>
                                        <List divided relaxed>
                                            <List.Item>
                                                <strong>ID</strong>
                                                <List.Content floated="right">
                                                    {file.id}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>UID</strong>
                                                <List.Content floated="right">
                                                    {file.uid}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Size</strong>
                                                <List.Content floated="right">
                                                    {filesize(file.size)}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>SHA-1</strong>
                                                <List.Content floated="right">
                                                    {file.sha1}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>DB created_at</strong>
                                                <List.Content floated="right">
                                                    {moment.utc(file.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>OS created_at</strong>
                                                <List.Content floated="right">
                                                    {
                                                        file.file_created_at ?
                                                            moment.utc(file.file_created_at).local().format('YYYY-MM-DD HH:mm:ss') :
                                                            null
                                                    }
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Type</strong>
                                                <List.Content floated="right">
                                                    {file.type}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Sub Type</strong>
                                                <List.Content floated="right">
                                                    {file.sub_type}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Mime Type</strong>
                                                <List.Content floated="right">
                                                    {file.mime_type}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Language</strong>
                                                <List.Content floated="right">
                                                    {language.flag ? <Flag name={language.flag}/> : null }
                                                    {language.text}
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Content Unit</strong>
                                                <List.Content floated="right">
                                                    {
                                                        file.content_unit_id ?
                                                            <Link
                                                                to={`/content_units/${file.content_unit_id}`}>{file.content_unit_id}</Link> :
                                                            "none"
                                                    }
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Parent</strong>
                                                <List.Content floated="right">
                                                    {
                                                        file.parent_id ?
                                                            <Link
                                                                to={`/files/${file.parent_id}`}>{file.parent_id}</Link> :
                                                            "none"
                                                    }
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Secure</strong>
                                                <List.Content floated="right">
                                                    <Header size="tiny"
                                                            content={SECURITY_LEVELS[file.secure].text}
                                                            color={SECURITY_LEVELS[file.secure].color}/>

                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <strong>Published</strong>
                                                <List.Content floated="right">
                                                    {
                                                        file.published ?
                                                            <Icon name="checkmark" color="green"/> :
                                                            <Icon name="ban" color="red"/>
                                                    }
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={6} textAlign="center">
                            {
                                ["audio", "video"].includes(types.type) ?
                                    <Player file={`http://files.bbdomain.org/get/${file.sha1}/${file.name}`}/> :
                                    null
                            }
                            <br/>
                            <Button content='Download'
                                    icon='download'
                                    color="purple"
                                    onClick={e => this.onDownload(e)}/>
                        </Grid.Column>
                    </Grid.Row>
                    {this.renderProperties()}
                    {this.renderDangerZone()}
                </Grid>
            </Segment>
        </div>;
    }
}

export default FileInfo;

