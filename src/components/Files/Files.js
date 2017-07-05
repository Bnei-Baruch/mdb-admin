import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import searcher from '../../hoc/searcher';
import * as filterComponents from '../Filters/filterComponents';

const InfiniteFileSearcher = searcher({
    namespace: 'files'
})(InfiniteSearch);

const ItemLinkRenderer = ({ cellData, dataKey }) =>
    <Link to={`/files/${cellData}`}>{cellData}</Link>;

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

const filters = [
    {
        name: 'query',
        label: 'Query',
        Component: filterComponents.TextFilter,
        props: {
            placeholder: 'Search files...'
        }
    },
    {
        name: 'start_date',
        label: 'Start Date',
        Component: filterComponents.DateFilter
    },
    {
        name: 'end_date',
        label: 'End Date',
        Component: filterComponents.DateFilter
    }
];

export default class Files extends Component {
    render() {
        return (
            <InfiniteFileSearcher
                filters={filters}
                columns={columns}
            />
        );
    }
}
