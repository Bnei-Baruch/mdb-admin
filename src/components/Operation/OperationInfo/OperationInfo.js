import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectTable from '../../ObjectTable/ObjectTable';
import apiClient from '../../../helpers/apiClient';
import dataLoader from '../../../hoc/dataLoader';
import { OPERATION_TYPE_BY_ID } from '../../../helpers/consts';

const operationColumn = [
    objectKey => ({ content: objectKey }),
    (objectKey, objectValue) => {
        let content;
        switch (objectKey) {
            case 'properties':
                content = !!objectValue ? <ObjectTable source={objectValue} /> : null;
                break;
            case 'type_id':
                content = `${OPERATION_TYPE_BY_ID[objectValue]} [${objectValue}]`;
                break;
            default:
                content = objectValue;
        }

        return { content };
    }
];

class OperationInfo extends Component {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        data: PropTypes.object
    };

    render() {
        const { data } = this.props;

        return (
            !!data && <ObjectTable
                source={data}
                header="Operation Info"
                columns={operationColumn} />
        );
    }
}

export default dataLoader(({ id }) => {
    return apiClient.get(`/rest/operations/${id}/`)
        .catch(error => {
            console.error('Error loading content operations, ' + error);
            throw new Error(error);
        })
})(OperationInfo);

