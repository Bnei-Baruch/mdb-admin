import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {List, Segment, Header} from "semantic-ui-react";
import dataLoader from '../../hoc/dataLoader';
import Collections from '../Collections/Collections';

import apiClient from '../../helpers/apiClient';


class ContentUnitCollections extends Component {

    static propTypes = {
        data: PropTypes.object,
        id: PropTypes.object,
    };

    render() {
        const files = this.props.data;
        if (!files) {
            return null;
        }
        return <div>
            <Header content="Collections"/>
            <Segment attached>
                <List>
                    {
                        files.data.map(f => (<List.Item>
                            <Link to={`/collections/${f.id}`}>{f.uid}</Link>
                        </List.Item>))
                    }
                </List>
            </Segment>
        </div>;
    }
}

export default dataLoader(({id}) => {
    return apiClient.get(`/rest/collections/?page_size=20`)
        .catch(error => {
            throw new Error(error);
        })
})(ContentUnitCollections);
