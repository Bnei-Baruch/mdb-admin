import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import searcher from '../../hoc/searcher';

const InfiniteFileSearcher = searcher({
    request: params => apiClient.get('/rest/files/', { params }),
    searchOnMount: true
})(InfiniteSearch);

const LinkToFileCellRenderer = ({ cellData, dataKey }) =>
    <Link to={`/files/${cellData}`}>{cellData}</Link>;

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

export default class Files extends Component {
    render() {
        return <InfiniteFileSearcher columns={columns} searchPlaceholder="Search files..." />;
    }
}
