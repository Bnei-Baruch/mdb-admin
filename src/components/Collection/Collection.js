import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import CollectionInfo from './CollectionInfo/CollectionInfo';
import apiClient from '../../helpers/apiClient';

import { Link } from 'react-router-dom';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import searcher from '../../hoc/searcher';

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
    request: (params, urlParams) => {
        return apiClient.get(`/rest/collections/${urlParams.id}/content_units/`, { params })
            // patch response for infinite search
            .then(response => {
                if (Array.isArray(response.data) && response.data.length) {
                    response.data = {
                        total: response.data.length,
                        data: response.data.map(ccu => {
                            const contentUnit = ccu.content_unit;
                            contentUnit.relationshipName = ccu.name;
                            return contentUnit;
                        })
                    }
                } else {
                    response.data = {
                        data: [],
                        total: 0
                    }
                }

                return response;
            });
    },
    searchOnMount: true
})(InfiniteSearch);

class Collection extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        const urlParams = {
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
                    <ContentUnitSearcher urlParams={urlParams}
                                         columns={columns}
                                        searchPlaceholder="Search..." />
                </Segment>
            </div>
        );
    }
}

Collection.Info = CollectionInfo;

export default Collection;
