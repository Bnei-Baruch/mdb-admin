import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import CollectionInfo from './CollectionInfo/CollectionInfo';
import apiClient from '../../helpers/apiClient';
import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import searcher from '../../hoc/searcher';
import { relationshipResponseToPaginated } from '../../helpers/apiResponseTransforms';

const LinkToFileCellRenderer = ({ cellData, dataKey }) =>
    <Link to={`/content_units/${cellData}`}>{cellData}</Link>;

const HebNameRenderer = ({ cellData }) => cellData && cellData.he && cellData.he.name;

const EnNameRenderer = ({ cellData }) => cellData && cellData.en && cellData.en.name;

const RuNameRenderer = ({ cellData }) => cellData && cellData.ru && cellData.ru.name;

const FilmDateRenderer = ({ cellData }) => cellData && cellData.film_date;

const IndexCellRenderer = ({ rowIndex }) => rowIndex;

const columns = [
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
            label="ID"
            dataKey="id"
            cellRenderer={LinkToFileCellRenderer}
            width={80} />,
    <Column key="uid"
            label="UID"
            dataKey="uid"
            width={80} />,
    <Column key="hebName"
            label="Heb Name"
            dataKey="i18n"
            width={80}
            cellRenderer={HebNameRenderer}
            flexGrow={1} />,
    <Column key="enName"
            label="En Name"
            dataKey="i18n"
            width={80}
            cellRenderer={EnNameRenderer}
            flexGrow={1} />,
    <Column key="ruName"
            label="Ru Name"
            dataKey="i18n"
            width={80}
            cellRenderer={RuNameRenderer}
            flexGrow={1} />,
    <Column key="filmDate"
            label="Film Date"
            dataKey="properties"
            cellRenderer={FilmDateRenderer}
            width={80}
            flexGrow={1} />
];

const ContentUnitSearcher = searcher({
    request: (params) => {
        return apiClient.get(`/rest/collections/${params.id}/content_units/`, { params })
            .then(response => relationshipResponseToPaginated(response, 'content_unit'))
    },
    searchOnMount: true
})(InfiniteSearch);

class Collection extends Component {

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
                <CollectionInfo id={this.props.match.params.id} />
                <Header attached="top">Collection's Content Units</Header>
                <Segment attached style={{ display: 'flex', flex: 1 }}>
                    <ContentUnitSearcher defaultParams={defaultParams}
                                         columns={columns}
                                         searchPlaceholder="Search..." />
                </Segment>
            </div>
        );
    }
}

Collection.Info = CollectionInfo;

export default Collection;
