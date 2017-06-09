import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {List, Segment, Header, Message} from "semantic-ui-react";
import dataLoader from '../../hoc/dataLoader';

import apiClient from '../../helpers/apiClient';


class ContentUnitFiles extends Component {

    static propTypes = {
        data: PropTypes.object,
        id: PropTypes.number,
    };

    renderFiles = (files) => {
        if (files.length === 0) {
            return (<Message size="tiny">No files found</Message>);
        }

        return (
            <List> {
                files.map(
                    f => (
                        <List.Item>
                            <Link to={`/files/${f.id}`}>{f.name}</Link>
                        </List.Item>)
                )
            }
            </List>
        );
    };

    render() {
        const files = this.props.data;
        if (!files) {
            return null;
        }

        return (<div>
            <Header content="Files"/>
            <Segment attached>
                {this.renderFiles(files)}
            </Segment>
        </div >);
    }
}

export default dataLoader(({id}) => {
    return apiClient.get(`/rest/content_units/${id}/files/`)
        .catch(error => {
            throw new Error(error);
        })
})(ContentUnitFiles);
//export default ContentUnitFiles;
