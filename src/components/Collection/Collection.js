import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectTable from '../ObjectTable/ObjectTable';
import apiClient from '../../helpers/apiClient';


const i18Columns = [
    objectKey => ({ content: objectKey }),
    (objectKeys, objectValue) => {
        const ignoredKeys = ['content_collection_id', 'language'];
        return {
            content: <ObjectTable source={objectValue} ignoreKeys={ignoredKeys} />
        };
    }
];

export default class Collection extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    state = {
        collection: null
    };

    columns = [
        objectKey => ({ content: objectKey }),
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

    componentDidMount() {
        this.getCollection(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getCollection(nextProps.match.params.id);
        }
    }

    getCollection = (id) => {
        apiClient.get(`/rest/collections/${id}/`)
             .then(response =>
                this.setState({
                    collection: response.data
                })
            ).catch(error => {
                throw Error('Error loading collections, ' + error);
            });
    };

    render() {
        const { collection } = this.state;
        if (!collection) {
            return null;
        }

        return (
            <ObjectTable
                header="Collection Info"
                source={collection}
                columns={this.columns}
            />
        );
    }
}
