import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectTable from '../ObjectTable/ObjectTable';
import apiClient from '../../helpers/apiClient';
import { OPERATION_TYPE_BY_ID } from '../../helpers/consts';


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

    componentDidMount() {
        this.getOperation(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getOperation(nextProps.match.params.id);
        }
    }

    getOperation = (id) => {
        apiClient.get(`/rest/operations/${id}/`)
             .then(response =>
                this.setState({
                    operation: response.data
                })
            ).catch(error => {
                throw Error('Error loading operation, ' + error);
            });
    };

    render() {
        const { operation } = this.state;
        if (!operation) {
            return null;
        }

        return (
            <ObjectTable
                header="Operation Info"
                source={operation}
                columns={this.columns}
            />
        );
    }
}
