import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import OperationInfo from './OperationInfo/OperationInfo';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import { relationshipResponseToPaginated } from '../../helpers/apiResponseTransforms';
import searcher from '../../hoc/searcher';
import { columns as fileColumns } from '../Files/Files';

const FileSearcher = searcher({
    name: 'operation.files',
    request: (params) => {
        return apiClient.get(`/rest/operations/${params.id}/files/`, { params })
            // patch response for infinite search
            .then(response => relationshipResponseToPaginated(response))
    },
    searchOnMount: true
})(InfiniteSearch);

class Operation extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        const defaultParams = {
            id: this.props.match.params.id
        };

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                <OperationInfo id={this.props.match.params.id} />
                <Header attached="top">Related Files</Header>
                <Segment attached style={{ display: 'flex', flex: '1 0 400px' }}>
                    <FileSearcher defaultParams={defaultParams}
                                        columns={fileColumns}
                                        searchPlaceholder="Search..." />
                </Segment>
            </div>
        );
    }
}

Operation.Info = OperationInfo;

export default Operation;
