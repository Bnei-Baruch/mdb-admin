import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import searcher from '../../hoc/searcher';

const InfiniteCollectionSearcher = searcher({
    request: params => apiClient.get('/rest/collections/', { params }),
    searchOnMount: true
})(InfiniteSearch);


const LinkToFileCellRenderer = ({ cellData, dataKey }) =>
    <Link to={`/collections/${cellData}`}>{cellData}</Link>;

const FilmDateRenderer = ({ cellData }) => {
    // This renders even when cellData is undefined (not fetched yet).
    if (!cellData) {
        return '';
    }
    return cellData.film_date;
};

const IndexCellRenderer = ({ rowIndex }) => rowIndex;

const columns = [
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

export default class Collections extends Component {
    render() {
        return <InfiniteCollectionSearcher columns={columns} searchPlaceholder="Search collection..." />;
    }
}
