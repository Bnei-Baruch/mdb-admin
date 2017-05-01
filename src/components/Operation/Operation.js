import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ObjectTable from '../ObjectTable/ObjectTable';
import apiClient from '../../helpers/apiClient';

export default class Operation extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    state = {
        operation: null
    };

    columns = [
        objectKey => ({ content: objectKey }),
        (objectKey, objectValue) => {
            let content;
            switch (objectKey) {
                case 'properties':
                    content = <ObjectTable source={objectValue} />;
                    break;
                default:
                    content = objectValue;
            }

            return { content };
        }
    ];

    componentDidMount() {
        this.getOperation(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.getOperation(nextProps.match.params.id);
        }
    }

    getOperation = (id) => {
        apiClient.get(`/rest/operations/${id}/`)
            .then(response => this.setState({ operation: response.data }))
            .catch(error => {
                throw Error('Error loading operations, ' + error);
            });
    };

    render() {
        const operation = this.state.operation;

        if (!operation) {
            return null;
        }

        return (
            <ObjectTable
                source={operation}
                header="Operation Info"
                columns={this.columns} />
        );
    }
}

