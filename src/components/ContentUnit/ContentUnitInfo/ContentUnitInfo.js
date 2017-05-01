import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectTable from '../../ObjectTable/ObjectTable';
import apiClient from '../../../helpers/apiClient';
import dataLoader from '../../../hoc/dataLoader';


const i18Columns = [
    objectKey => ({ content: objectKey, collapsing: true }),
    (objectKeys, objectValue) => {
        const ignoredKeys = ['content_unit_id', 'language'];
        return {
            content: <ObjectTable source={objectValue} ignoreKeys={ignoredKeys} />
        };
    }
];

const infoColumns = [
    objectKey => ({ content: objectKey, collapsing: true }),
    (objectKey, objectValue) => {
        let content;
        switch (objectKey) {
            case 'properties':
                content = <ObjectTable source={objectValue} />;
                break;
            case 'i18n':
                content = <ObjectTable source={objectValue} columns={i18Columns} />;
                break;
            default:
                content = objectValue;
        }

        return { content };
    }
];

class ContentUnitInfo extends Component {

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
                header="Content Unit Info"
                source={data}
                columns={infoColumns}
            />
        );
    }
}

export default dataLoader(({ id }) => {
    return apiClient.get(`/rest/content_units/${id}/`)
        .catch(error => {
            console.error('Error loading content unit, ' + error);
            throw new Error(error);
        })
})(ContentUnitInfo);
