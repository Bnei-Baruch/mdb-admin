import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {List, Segment, Header} from "semantic-ui-react";
import dataLoader from '../../hoc/dataLoader';

import apiClient from '../../helpers/apiClient';


class ContentUnitFiles extends Component {

    static propTypes = {
        data: PropTypes.object,
        id: PropTypes.number,
    };

    render() {
        const files = this.props.data;
        if (!files) {
            return null;
        }

        return <div>
            <Header content="Files"/>
            <Segment attached>
                <List>
                    {
                        files.data.map(f => (<List.Item>
                            <Link to={`/files/${f.id}`}>{f.name}</Link>
                        </List.Item>))
                    }
                </List>
            </Segment>
        </div>;
    }
}

export default dataLoader(({id}) => {
    return apiClient.get(`/rest/files/?page_size=20`)
        .catch(error => {
            throw new Error(error);
        })
})(ContentUnitFiles);
//export default ContentUnitFiles;
