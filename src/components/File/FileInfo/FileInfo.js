import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import filesize from 'filesize';
import ObjectTable from '../../ObjectTable/ObjectTable';
import apiClient from '../../../helpers/apiClient';
import dataLoader from '../../../hoc/dataLoader';

const infoColumn = [
    objectKey => ({ content: objectKey }),
    (objectKey, objectValue) => {
        let content;
        switch (objectKey) {
            case 'size':
                content = filesize(objectValue);
                break;
            case 'properties':
                content = <ObjectTable source={objectValue} />;
                break;
            case 'content_unit_id':
                content = <Link to={`/content_units/${objectValue}`}>{objectValue}</Link>;
                break;
            default:
                content = objectValue;
        }

        return { content };
    }
];

class FileInfo extends Component {

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
                header="File Info"
                columns={infoColumn} />
        );
    }
}

export default dataLoader(({ id }) => {
    return apiClient.get(`/rest/files/${id}/`)
        .catch(error => {
            console.error('Error loading content files, ' + error);
            throw new Error(error);
        })
})(FileInfo);

