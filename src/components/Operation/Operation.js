import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import OperationInfo from './OperationInfo/OperationInfo';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import searcher from '../../hoc/searcher';
import * as filterComponents from '../Filters/filterComponents';
import { columns as fileColumns } from '../Files/Files';

const FileSearcher = searcher({
    namespace: 'operation.files',
})(InfiniteSearch);

const filters = [
    {
        name: 'query',
        label: 'Query',
        Component: filterComponents.TextFilter,
        props: {
            placeholder: 'Search file...'
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

class Operation extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        const extra = {
            id: this.props.match.params.id
        };

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}>
                <OperationInfo id={this.props.match.params.id} />
                <Header attached="top">Related Files</Header>
                <Segment attached style={{ display: 'flex', flex: '1 0 400px' }}>
                    <FileSearcher 
                        filters={filters}
                        extra={extra}
                        columns={fileColumns}
                    />
                </Segment>
            </div>
        );
    }
}

Operation.Info = OperationInfo;

export default Operation;
