import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import filesize from 'filesize';
import ObjectTable from '../ObjectTable/ObjectTable';
import apiClient from '../../helpers/apiClient';

export default class File extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    state = {
        file: null
    };

    columns = [
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

    componentDidMount() {
        this.getFile(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.getFile(nextProps.match.params.id);
        }
    }

    getFile = (id) => {
        apiClient.get(`/rest/files/${id}/`)
            .then(response => this.setState({ file: response.data }))
            .catch(error => {
                throw Error('Error loading files, ' + error);
            });
    };

    render() {
        const file = this.state.file;

        if (!file) {
            return null;
        }

        return (
            <ObjectTable
                source={file}
                header="File Info"
                columns={this.columns} />
        );
    }
}
