import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectTable from '../ObjectTable/ObjectTable';
import columnCell from '../../hoc/columnCell';
import apiClient from '../../helpers/apiClient';

export default class ContentUnit extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    state = {
        unit: null
    };

    columns = [
        columnCell('key'),
        columnCell('value')
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
        apiClient.get(`/rest/content_units/${id}`)
             .then(response =>
                this.setState({
                    unit: response.data.data
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
