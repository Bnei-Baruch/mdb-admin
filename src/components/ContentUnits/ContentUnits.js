import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import * as filterComponents from '../Filters/filterComponents';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import { CONTENT_TYPE_BY_ID, LANG_HEBREW, LANG_ENGLISH, LANG_RUSSIAN } from '../../helpers/consts';
import searcher from '../../hoc/searcher';

const InfiniteContentUnitSearcher = searcher({
    namespace: 'content_units'
})(InfiniteSearch);


const ItemLinkRenderer = ({ cellData, dataKey }) =>
    <Link to={`/content_units/${cellData}`}>{cellData}</Link>;

const NameRenderer = (lang) => ({ cellData }) => !!cellData && !!cellData[lang] && cellData[lang].name;

const FilmDateRenderer = ({ cellData }) => !!cellData && cellData.film_date;

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
            width={80} />,
    <Column key="type"
            label='Type'
            dataKey='type_id'
            cellRenderer={ContentTypeRenderer}
            width={160} />,
    <Column key="hebName"
            label='Heb Name'
            dataKey='i18n'
            width={80}
            cellRenderer={NameRenderer(LANG_HEBREW)}
            flexGrow={1}
            className="rtl-dir"/>,
    <Column key="enName"
            label='En Name'
            dataKey='i18n'
            width={80}
            cellRenderer={NameRenderer(LANG_ENGLISH)}
            flexGrow={1} />,
    <Column key="ruName"
            label='Ru Name'
            dataKey='i18n'
            width={80}
            cellRenderer={NameRenderer(LANG_RUSSIAN)}
            flexGrow={1} />,
    <Column key="filmDate"
            label='Film Date'
            dataKey='properties'
            cellRenderer={FilmDateRenderer}
            width={80}
            flexGrow={1} />
];

const filters = [
    {
        name: 'query',
        label: 'Query',
        Component: filterComponents.TextFilter,
        props: {
            placeholder: 'Search content units...'
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
    },
    {
        name: 'content_type',
        label: 'Content Types',
        Component: filterComponents.ContentTypeFilter
    }, {
        name: 'content_source',
        label: 'Content Sources',
        Component: filterComponents.ContentSourceFilter
    }
];

export default class ContentUnits extends Component {
    render() {
        return (
            <InfiniteContentUnitSearcher
                columns={columns}
                searchPlaceholder="Search content units..."
                filters={filters}
            />
        );
    }
}
