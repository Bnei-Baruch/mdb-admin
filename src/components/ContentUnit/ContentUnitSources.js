import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {List, Segment, Header, Message, Menu} from "semantic-ui-react";
import dataLoader from '../../hoc/dataLoader';

import apiClient from '../../helpers/apiClient';


class ContentUnitSources extends Component {

    static propTypes = {
        data: PropTypes.array,
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
    };

    renderSources = (sources) => {
        if (sources.length === 0) {
            return (<Message size="tiny">No sources found</Message>);
        }

        return (
            <List> {
                sources.map(
                    f => (
                        <List.Item>
                            <Link to={`/sources/${f.id}`}>{f.name}</Link>
                        </List.Item>
                    )
                )
            }
            </List>
        );
    };

    render() {
        let sources = this.props.data;
        if (!sources) {
            return null;
        }
        return <div>
            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header content="Sources" size="medium" color="blue"/>
                </Menu.Item>
            </Menu>
            <Segment attached>
                {this.renderSources(sources)}
            </Segment>
        </div>;
    }
}

export default dataLoader(({id}) => {
    return apiClient.get(`/rest/content_units/${id}/sources/`)
        .catch(error => {
            throw new Error(error);
        })
})(ContentUnitSources);
