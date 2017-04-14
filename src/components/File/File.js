import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import filesize from 'filesize';
import ObjectTable from '../ObjectTable/ObjectTable';
import columnCell from '../../hoc/columnCell';
import apiClient from '../../helpers/apiClient';

export default class File extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    state = {
        file: null
    };

    columns = [
        columnCell('key'),
        columnCell(class extends PureComponent {
            render() {
                const { cellKey, cellValue } = this.props;
                switch (cellKey) {
                    case 'size':
                        return <div>{filesize(cellValue)}</div>;
                    case 'properties':
                        return <ObjectTable source={cellValue} />
                    case 'content_unit_id':
                        return <Link to={`/content_units/${cellValue}`}>{cellValue}</Link>;
                    default:
                        return <div>{cellValue}</div>;
                }
            }
        })
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

