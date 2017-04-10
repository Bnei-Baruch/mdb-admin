import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import apiClient from '../../helpers/apiClient';


const ObjectTable = ({ object }) => {
    if (!object) {
        return null;
    }

    return (
        <Table celled striped>
            <Table.Body>
                {
                    Object.keys(object).map(key => 
                        <Table.Row key={key}>
                            <Table.Cell collapsing>
                                <div>{ key }</div>
                            </Table.Cell>
                            <Table.Cell>
                                <div>{ object[key] }</div>
                            </Table.Cell>
                        </Table.Row>
                    )
                }
            </Table.Body>
        </Table>
    );
};
ObjectTable.propTypes = {
    object: PropTypes.object
};

const transformValues = (key, value) => {
    switch (key) {
        // case 'size':
        //     return filesize(value);
        default:
            return value;
    }
}

export default class Unit extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    }

    state = {
        unit: null
    };

    componentDidMount() {
        this.getUnit(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getUnit(nextProps.match.params.id);
        }
    }

    getUnit = (id) => {
        apiClient.get(`/rest/units/${id}`)
            .then(response => 
                this.setState({
                    unit: response.data.unit
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
            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>Unit info</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        Object.keys(unit).map(key => 
                            <Table.Row key={key}>
                                <Table.Cell collapsing>
                                    <div>{ key }</div>
                                </Table.Cell>
                                <Table.Cell>
                                    {
                                        key === 'properties' 
                                            ? <ObjectTable object={unit[key]} />
                                            : <div>{ transformValues(key, unit[key]) }</div>
                                    }
                                </Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body> 
            </Table>
        );
    }

}
