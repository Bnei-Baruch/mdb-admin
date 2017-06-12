import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {List, Segment, Header, Message, Menu} from "semantic-ui-react";
import dataLoader from '../../hoc/dataLoader';

import apiClient from '../../helpers/apiClient';


class ContentUnitTags extends Component {

    static propTypes = {
        data: PropTypes.array,
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
    };

    renderTags = (tags) => {
        if (tags.length === 0) {
            return (<Message size="tiny">No tags found</Message>);
        }

        return (
            <List> {
                tags.map(
                    f => (
                        <List.Item>
                            <Link to={`/tags/${f.id}`}>{f.name}</Link>
                        </List.Item>
                    )
                )
            }
            </List>
        );
    };

    render() {
        let tags = this.props.data;
        if (!tags) {
            return null;
        }
        return <div>
            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header content="Tags" size="medium" color="blue"/>
                </Menu.Item>
            </Menu>
            <Segment attached>
                {this.renderTags(tags)}
            </Segment>
        </div>;
    }
}

export default dataLoader(({id}) => {
    return apiClient.get(`/rest/content_units/${id}/tags/`)
        .catch(error => {
            throw new Error(error);
        })
})(ContentUnitTags);
