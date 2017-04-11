import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfoTable from '../InfoTable/InfoTable';
import apiClient from '../../helpers/apiClient';

export default class ContentUnit extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    }

    state = {
        unit: null
    };

    cells = [
        'key',
        'value'
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
            <InfoTable
                header="Unit Info"
                source={unit}
                cells={this.cells}
            />
        );
    }
}
