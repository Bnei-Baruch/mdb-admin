import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import { OPERATION_TYPE_BY_ID } from '../../helpers/consts';
import searcher from '../../hoc/searcher';

const InfiniteOperationSearcher = searcher({
    request: params => apiClient.get('/rest/operations/', { params }),
    searchOnMount: true
})(InfiniteSearch);

const ItemLinkRenderer = ({ cellData, dataKey }) =>
    <Link to={`/operations/${cellData}`}>{cellData}</Link>;

const OperationTypeRenderer = ({ cellData }) => OPERATION_TYPE_BY_ID[cellData];

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
            cellRenderer={ItemLinkRenderer}
            width={80} />,
    <Column key="uid"
            label='UID'
            dataKey='uid'
            width={160} />,
    <Column key="type"
            label='Type'
            dataKey='type_id'
            cellRenderer={OperationTypeRenderer}
            width={160} />,
    <Column key="created_at"
            label='Created at'
            dataKey='created_at'
            width={160}
            flexGrow={1} />,
    <Column key='station'
            label='Station'
            dataKey='station'
            width={80}
            flexGrow={1} />,
    <Column key='user_id'
            label='USER ID'
            dataKey='user_id'
            width={80} />,
    <Column key='details'
            label='DETAILS'
            dataKey='details'
            width={80}
            flexGrow={1} />
];

export default class Operations extends Component {
    render() {
        return <InfiniteOperationSearcher columns={columns} searchPlaceholder='Search operations...' />;
    }
}
