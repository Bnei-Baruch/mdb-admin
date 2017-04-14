import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import filesize from 'filesize';
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
        case 'size':
            return filesize(value);
        default:
            return value;
    }
};

export default class File extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
    }

    componentDidMount() {
        this.getFile(this.props.match.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getFile(nextProps.match.params.id);
        }
    }

    getFile = (id) => {
        apiClient.get(`/rest/files/${id}/`)
            .then(response => 
                this.setState({file: response.data})
            ).catch(error => {
                throw Error('Error loading files, ' + error);
            });
    };

    render() {
        const file = this.state.file;

        if (!file) {
            return null;
        }

        return (
            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>File info</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        Object.keys(file).map(key => 
                            <Table.Row key={key}>
                                <Table.Cell collapsing>
                                    <div>{ key }</div>
                                </Table.Cell>
                                <Table.Cell>
                                    {
                                        key === 'properties' 
                                            ? <ObjectTable object={file[key]} />
                                            : <div>{ transformValues(key, file[key]) }</div>
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
