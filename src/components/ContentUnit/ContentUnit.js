import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectTable from '../ObjectTable/ObjectTable';
import apiClient from '../../helpers/apiClient';


const i18Columns = [
    objectKey => ({ content: objectKey }),
    (objectKeys, objectValue) => {
        const ignoredKeys = ['content_unit_id', 'language'];
        return {
            content: <ObjectTable source={objectValue} ignoreKeys={ignoredKeys} />
        };
    }
];

export default class ContentUnit extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    state = {
        unit: null
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
        this.getUnit(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getUnit(nextProps.match.params.id);
        }
    }

    getUnit = (id) => {
        apiClient.get(`/rest/content_units/${id}/`)
             .then(response =>
                this.setState({
                    unit: response.data
                })
            ).catch(error => {
                throw Error('Error loading units, ' + error);
            });
    };

    render() {
        const { unit } = this.state;
        if (!unit) {
            return null;
        }

        return (
            <ObjectTable
                header="Unit Info"
                source={unit}
                columns={this.columns}
            />
        );
    }
}
