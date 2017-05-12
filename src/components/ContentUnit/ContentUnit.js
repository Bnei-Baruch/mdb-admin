import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import { Column } from 'react-virtualized';
import ContentUnitInfo from './ContentUnitInfo/ContentUnitInfo';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import { relationshipResponseToPaginated } from '../../helpers/apiResponseTransforms';
import searcher from '../../hoc/searcher';
import { columns as collectionColumns } from '../Collections/Collections';
import { columns as fileColumns } from '../Files/Files';

const collectionRelationshipColumns = [
    collectionColumns[0],
    <Column key="relationshipName"
            label="Relationship"
            dataKey="relationshipName"
            width={120} />,
    collectionColumns.slice(1)
];

const CollectionSearcher = searcher({
    name: 'content-unit.collections',
    request: (params) => {
        return apiClient.get(`/rest/content_units/${params.id}/collections/`, { params })
            // patch response for infinite search
            .then(response => relationshipResponseToPaginated(response, 'collection'))
    },
    searchOnMount: true
})(InfiniteSearch);

const FileSearcher = searcher({
    name: 'content-unit.files',
    request: (params) => {
        return apiClient.get(`/rest/content_units/${params.id}/files/`, { params })
            // patch response for infinite search
            .then(response => relationshipResponseToPaginated(response))
    },
    searchOnMount: true
})(InfiniteSearch);

class ContentUnit extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    }

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
                <ContentUnitInfo id={this.props.match.params.id} />
                <Header attached="top">Content Unit's Collections</Header>
                <Segment attached style={{ display: 'flex', flex: '1 0 400px' }}>
                    <CollectionSearcher defaultParams={defaultParams}
                                        columns={collectionRelationshipColumns}
                                        searchPlaceholder="Search..." />
                </Segment>
                <Header attached="top">Content Unit's Files</Header>
                <Segment attached style={{ display: 'flex', flex: '1 0 400px' }}>
                    <FileSearcher defaultParams={defaultParams}
                                        columns={fileColumns}
                                        searchPlaceholder="Search..." />
                </Segment>
            </div>
        );
    }
}

ContentUnit.Info = ContentUnitInfo;

export default ContentUnit;
