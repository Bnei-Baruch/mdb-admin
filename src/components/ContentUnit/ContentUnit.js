import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import ObjectTable from '../ObjectTable/ObjectTable';
import columnCell from '../../hoc/columnCell';
import apiClient from '../../helpers/apiClient';


const i18Columns = [
    columnCell('key'),
    columnCell(class extends PureComponent {
        ignoredKeys = ['content_unit_id', 'language'];

        render() {
            const { cellValue } = this.props;
            return <ObjectTable source={cellValue} ignoreKeys={this.ignoredKeys} />
        }
    })
];

export default class ContentUnit extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    state = {
        unit: null
    };

    columns = [
        columnCell('key'),
        columnCell(class extends PureComponent {
            render() {
                const { cellKey, cellValue } = this.props;
                switch (cellKey) {
                    case 'properties':
                        return <ObjectTable source={cellValue} />;
                    case 'i18n':
                        return <ObjectTable source={cellValue} columns={i18Columns} />;
                    default:
                        return <div>{cellValue}</div>;
                }
            }
        })
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
