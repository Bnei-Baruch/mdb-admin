import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import { Column } from 'react-virtualized';
import { Link } from 'react-router-dom';
import ContentUnitInfo from './ContentUnitInfo/ContentUnitInfo';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import { relationshipResponseToPaginated } from '../../helpers/apiResponseTransforms';
import searcher from '../../hoc/searcher';

const LinkToCollectionCellRenderer = ({ cellData, dataKey }) =>
    <Link to={`/collections/${cellData}`}>{cellData}</Link>;

const FilmDateRenderer = ({ cellData }) => {
    // This renders even when cellData is undefined (not fetched yet).
    if (!cellData) {
        return '';
    }
    return cellData.film_date;
};

const IndexCellRenderer = ({ rowIndex }) => rowIndex;

const collectionsColumns = [
    <Column key="index"
            label='Index'
            cellRenderer={IndexCellRenderer}
            dataKey='index'
            width={60} />,
    <Column key="relationshipName"
            label="Relationship"
            dataKey="relationshipName"
            width={120} />,
    <Column key="id"
            label='ID'
            dataKey='id'
            cellRenderer={LinkToCollectionCellRenderer}
            width={80} />,
    <Column key="uid"
            label='UID'
            dataKey='uid'
            width={160} />,
    <Column key="filmDate"
            label='Film Date'
            dataKey='properties'
            cellRenderer={FilmDateRenderer}
            width={160} />,
    <Column key="created_at"
            label='Created at'
            dataKey='created_at'
            width={160}
            flexGrow={1} />
];

const CollectionSearcher = searcher({
    request: (params) => {
        return apiClient.get(`/rest/content_units/${params.id}/collections/`, { params })
            // patch response for infinite search
            .then(response => relationshipResponseToPaginated(response, 'collection'))
    },
    searchOnMount: true
})(InfiniteSearch);

const LinkToFileCellRenderer = ({ cellData, dataKey }) =>
    <Link to={`/files/${cellData}`}>{cellData}</Link>;

const filesColumns = [
    <Column key="index"
            label='Index'
            cellRenderer={IndexCellRenderer}
            dataKey='index'
            width={60} />,
    <Column key="id"
            label='ID'
            dataKey='id'
            cellRenderer={LinkToFileCellRenderer}
            width={80} />,
    <Column key="uid"
            label='UID'
            dataKey='uid'
            width={80} />,
    <Column key="name"
            label='Name'
            dataKey='name'
            width={160}
            flexGrow={1} />,
    <Column key="file_created_at"
            label='Created at'
            dataKey='file_created_at'
            width={80}
            flexGrow={1} />
];

const FileSearcher = searcher({
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
                <ContentUnitInfo id={this.props.match.params.id} />
                <Header attached="top">Content Unit's Collections</Header>
                <Segment attached style={{ display: 'flex', flex: '1 0 400px' }}>
                    <CollectionSearcher defaultParams={defaultParams}
                                        columns={collectionsColumns}
                                        searchPlaceholder="Search..." />
                </Segment>
                <Header attached="top">Content Unit's Files</Header>
                <Segment attached style={{ display: 'flex', flex: '1 0 400px' }}>
                    <FileSearcher defaultParams={defaultParams}
                                        columns={filesColumns}
                                        searchPlaceholder="Search..." />
                </Segment>
            </div>
        );
    }
}

ContentUnit.Info = ContentUnitInfo;

export default ContentUnit;
