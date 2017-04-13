import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';
import { Link } from 'react-router-dom';
import ObjectTable from '../ObjectTable/ObjectTable';
import column from '../../hoc/column';
import apiClient from '../../helpers/apiClient';

export default class File extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    columns = [
        column('key'),
        column(class extends PureComponent {
            render() {
                const { cellKey, cellValue } = this.props;
                switch (cellKey) {
                    case 'size':
                        return filesize(cellValue);
                    case 'properties':
                        return <ObjectTable source={cellValue} />
                    case 'content_unit_id':
                        return <Link to={`/content_units/${cellValue}`}>{cellValue}</Link>;
                    default:
                        return cellValue;
                }
            }
        })
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
            <ObjectTable
                source={file}
                header="File Info"
                columns={this.columns}
            />
        );
    }
}
