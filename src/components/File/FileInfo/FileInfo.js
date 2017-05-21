import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import moment from "moment";
import filesize from "filesize";
import {Button, Flag, Grid, Header, Icon, List} from "semantic-ui-react";
import apiClient from "../../../helpers/apiClient";
import dataLoader from "../../../hoc/dataLoader";
import Player from "../../Player/JWPlayer";
import {fileIcon, fileTypes} from "../../../helpers/utils";
import {LANGUAGES} from "../../../helpers/consts";

class FileInfo extends Component {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        data: PropTypes.object
    };

    onDownload() {
        const data = this.props.data,
            url = `http://files.bbdomain.org/get/${data.sha1}/${data.name}`;
        window.open(url, '_blank');
    }

    renderProperties() {
        const p = this.props.data.properties;
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

    render() {
        const {data} = this.props;
        if (!data) {
            return null;
        }

        const language = LANGUAGES[data.language] || {text: "none"},
            icon = fileIcon(data),
            types = fileTypes(data);

        return <Grid container>
            <Grid.Row>
                <Grid.Column>
                    <Header size="large">
                        <Icon name={icon}/>
                        <Header.Content>
                            {data.name}
                            <Header.Subheader>
                                Created at &nbsp;
                                {moment.utc(data.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column width={10}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={14}>
                                <List divided>
                                    <List.Item>
                                        <strong>ID:</strong>
                                        <List.Content floated="right">
                                            {data.id}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>UID:</strong>
                                        <List.Content floated="right">
                                            {data.uid}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>Size:</strong>
                                        <List.Content floated="right">
                                            {filesize(data.size)}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>SHA-1:</strong>
                                        <List.Content floated="right">
                                            {data.sha1}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>OS created_at:</strong>
                                        <List.Content floated="right">
                                            {
                                                data.file_created_at ?
                                                    moment.utc(data.file_created_at).local().format('YYYY-MM-DD HH:mm:ss') :
                                                    null
                                            }
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>Type:</strong>
                                        <List.Content floated="right">
                                            {data.type}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>Sub Type:</strong>
                                        <List.Content floated="right">
                                            {data.sub_type}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>Mime Type:</strong>
                                        <List.Content floated="right">
                                            {data.mime_type}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>Language:</strong>
                                        <List.Content floated="right">
                                            {language.flag ? <Flag name={language.flag}/> : null }
                                            {language.text}
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>Content Unit:</strong>
                                        <List.Content floated="right">
                                            {
                                                data.content_unit_id ?
                                                    <Link
                                                        to={`/content_units/${data.content_unit_id}`}>{data.content_unit_id}</Link> :
                                                    "none"
                                            }
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <strong>Parent:</strong>
                                        <List.Content floated="right">
                                            {
                                                data.parent_id ?
                                                    <Link to={`/files/${data.parent_id}`}>{data.parent_id}</Link> :
                                                    "none"
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
                            <Player file={`http://files.bbdomain.org/get/${data.sha1}/${data.name}`}/> :
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
        </Grid>;
    }
}

export default dataLoader(({id}) => {
    return apiClient.get(`/rest/files/${id}/`)
        .catch(error => {
            console.error('Error loading content files, ' + error);
            throw new Error(error);
        })
})(FileInfo);

