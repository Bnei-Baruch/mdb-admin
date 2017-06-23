import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import { CONTENT_TYPE_BY_ID } from '../../helpers/consts';
import searcher from '../../hoc/searcher';

const InfiniteCollectionSearcher = searcher({
    name: 'collections',
    request: params => apiClient.get('/rest/collections/', { params }),
    searchOnMount: true
})(InfiniteSearch);


const ItemLinkRenderer = ({ cellData, dataKey }) =>
    <Link to={`/collections/${cellData}`}>{cellData}</Link>;

const FilmDateRenderer = ({ cellData }) => {
    // This renders even when cellData is undefined (not fetched yet).
    if (!cellData) {
        return '';
    }
    return cellData.film_date;
};

const ContentTypeRenderer = ({ cellData }) => CONTENT_TYPE_BY_ID[cellData];

const IndexCellRenderer = ({ rowIndex }) => rowIndex;

export const columns = [
    <Column key="index"
            label='Index'
            cellRenderer={IndexCellRenderer}
            dataKey='index'
            width={60} />,
    <Column key="id"
            label='ID'
            dataKey='id'
            cellRenderer={ItemLinkRenderer}
            width={80} />,
    <Column key="uid"
            label='UID'
            dataKey='uid'
            width={160} />,
    <Column key="type"
            label='Type'
            dataKey='type_id'
            cellRenderer={ContentTypeRenderer}
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

// FIXME: (yaniv) add filter config here

export default class Collections extends Component {
    render() {
        return (
            <InfiniteCollectionSearcher
                columns={columns}
                searchPlaceholder="Search collection..."
            />
        );
    }
}
