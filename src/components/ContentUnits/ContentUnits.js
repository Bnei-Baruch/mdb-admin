import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import searcher from '../../hoc/searcher';

const InfiniteContentUnitSearcher = searcher({
    request: params => apiClient.get('/rest/content_units/', { params }),
    searchOnMount: true
})(InfiniteSearch);


const LinkToFileCellRenderer = ({ cellData, dataKey }) =>
    <Link to={`/content_units/${cellData}`}>{cellData}</Link>;

const HebNameRenderer = ({ cellData }) => {
    const lang = cellData.he;
    return !!lang && lang.name;
};

const EnNameRenderer = ({ cellData }) => {
    const lang = cellData.en;
    return !!lang && lang.name;
};

const RuNameRenderer = ({ cellData }) => {
    const lang = cellData.ru;
    return !!lang && lang.name;
};

const FilmDateRenderer = ({ cellData }) => cellData.film_date;

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
    <Column key="hebName"
            label='Heb Name'
            dataKey='i18n'
            width={80}
            cellRenderer={HebNameRenderer}
            flexGrow={1} />,
    <Column key="enName"
            label='En Name'
            dataKey='i18n'
            width={80}
            cellRenderer={EnNameRenderer}
            flexGrow={1} />,
    <Column key="ruName"
            label='Ru Name'
            dataKey='i18n'
            width={80}
            cellRenderer={RuNameRenderer}
            flexGrow={1} />,
    <Column key="filmDate"
            label='Film Date'
            dataKey='properties'
            cellRenderer={FilmDateRenderer}
            width={80}
            flexGrow={1} />
];

export default class ContentUnits extends Component {
    render() {
        return <InfiniteContentUnitSearcher columns={columns} searchPlaceholder="Search content units..." />;
    }
}
