import React, { Component } from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';
import { Link } from 'react-router-dom';
import InfoTable from '../InfoTable/InfoTable';
import SimpleObjectTable from '../SimpleObjectTable/SimpleObjectTable';
import apiClient from '../../helpers/apiClient';

export default class File extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    }

    cells = [
        'key',
        (key, value) => {
            switch (key) {
                case 'size':
                    return filesize(value);
                case 'properties':
                    return <SimpleObjectTable object={value} />
                case 'content_unit_id':
                    return <Link to={`/content_units/${value}`}>{value}</Link>;
                default:
                    return value;
            }
        }
    ];

    state = {
        file: null
    };

    componentDidMount() {
        this.getFile(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getFile(nextProps.match.params.id);
        }
    }

    getFile = (id) => {
        apiClient.get(`/rest/files/${id}`)
            .then(response =>
                this.setState({
                    file: response.data.data
                })
            ).catch(error => {
                throw Error('Error loading files, ' + error);
            });
    };

    render() {
        const { file } = this.state;
        if (!file) {
            return null;
        }

        return (
            <InfoTable
                source={file}
                header="File Info"
                cells={this.cells}
            />
        );
    }
}
