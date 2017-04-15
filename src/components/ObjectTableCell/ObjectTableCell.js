import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

export default class ObjectTableCell extends Component {
    static propTypes = {
        objectKey: PropTypes.any.isRequired,
        objectValue: PropTypes.any,
        defintion: PropTypes.func,
        rowIndex: PropTypes.number,
        columnIndex: PropTypes.number
    };

    render() {
        const { objectKey, objectValue, definition, rowIndex, columnIndex, ...rest } = this.props;
        const cellProps = definition(objectKey, objectValue, rowIndex, columnIndex, ...rest);

        if (!cellProps.content) {
            cellProps.content = objectValue;
        }

        return <Table.Cell verticalAlign="top" {...cellProps} />;
    }
}