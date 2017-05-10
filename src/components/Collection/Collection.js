import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import CollectionInfo from './CollectionInfo/CollectionInfo';
import apiClient from '../../helpers/apiClient';
import { Column } from 'react-virtualized';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import searcher from '../../hoc/searcher';
import { relationshipResponseToPaginated } from '../../helpers/apiResponseTransforms';
import { columns as contentUnitColumns } from '../ContentUnits/ContentUnits';

const contentUnitRelationshipColumns = [
    contentUnitColumns[0],
    <Column key="relationshipName"
        label="Relationship"
        dataKey="relationshipName"
        width={120} />,
    contentUnitColumns.slice(1)
]

const ContentUnitSearcher = searcher({
    name: 'collection.content-units',
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
                                         columns={contentUnitRelationshipColumns}
                                         searchPlaceholder="Search..." />
                </Segment>
            </div>
        );
    }
}

Collection.Info = CollectionInfo;

export default Collection;
