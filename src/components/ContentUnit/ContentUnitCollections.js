import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {List, Segment, Header, Message, Menu} from "semantic-ui-react";
import dataLoader from '../../hoc/dataLoader';
import Collections from '../Collections/Collections';

import apiClient from '../../helpers/apiClient';


class ContentUnitCollections extends Component {

    static propTypes = {
        data: PropTypes.object,
        id: PropTypes.object,
    };

    renderCollections = (collections) => {
        if (collections.length === 0) {
            return (<Message size="tiny">No collection found</Message>);
        }

        return (
            <List> {
                collections.map(
                    f => (
                        <List.Item>
                            <Link to={`/collections/${f.id}`}>{f.name}</Link>
                        </List.Item>
                    )
                )
            }
            </List>
        );
    };

    render() {
        let collections = this.props.data;
        if (!collections) {
            return null;
        }
        return <div>

            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header content="Collections" size="medium" color="blue" />
                </Menu.Item>
            </Menu>
            <Segment attached>
                {this.renderCollections(collections)}
            </Segment>
        </div>;
    }
}

export default dataLoader(({id}) => {
    return apiClient.get(`/rest/content_units/${id}/collections/`)
        .catch(error => {
            throw new Error(error);
        })
})(ContentUnitCollections);
