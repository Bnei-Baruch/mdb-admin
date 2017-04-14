import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import columnCell from '../../hoc/columnCell';

export default class ObjectTable extends PureComponent {

    static propTypes = {
        source: PropTypes.object.isRequired,
        columns: PropTypes.array,
        header: PropTypes.string,
        ignoreKeys: PropTypes.array
    };

    static defaultProps = {
        header: '',
        columns: [
            columnCell('key'),
            columnCell('value')
        ],
        ignoreKeys: []
    };

    isKeyIgnored = (key) => ~this.props.ignoreKeys.indexOf(key);

    render() {
        const { columns, source, header } = this.props;

        return (
            <Table definition structured striped>
                {
                    !!header && <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan={columns.length}>{header}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                }
                <Table.Body>
                    {
                        Object.keys(source).filter(key => !this.isKeyIgnored(key)).map((key, rowIndex) => {
                            const id = source.id;
                            const value = source[key];
                            return (
                                <Table.Row key={`${id}_${key}_${rowIndex}`}>
                                    {
                                        columns.map((CellComponent, columnIndex) => {
                                            const columnKey = `${id}_${key}_${columnIndex}`;
                                            return (
                                                <Table.Cell collapsing={false} verticalAlign="top" key={columnKey}>
                                                    <CellComponent
                                                        cellKey={key}
                                                        cellValue={value}
                                                        rowIndex={rowIndex}
                                                        columnIndex={columnIndex} />
                                                </Table.Cell>
                                            );
                                        })
                                    }
                                </Table.Row>
                            );
                        })
                    }
                </Table.Body>
            </Table>
        );
    }

}
