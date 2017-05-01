import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import ObjectTableCell from '../ObjectTableCell/ObjectTableCell';

export default class ObjectTable extends PureComponent {

    static propTypes = {
        source: PropTypes.object,
        columns: PropTypes.array,
        header: PropTypes.string,
        ignoreKeys: PropTypes.array
    };

    static defaultProps = {
        header: '',
        columns: [
            objectKey => ({ content: objectKey, collapsing: true }),
            (objectKey, objectValue) => ({ content: objectValue }),
        ],
        ignoreKeys: []
    };

    render() {
        const { columns, source, header, ignoreKeys, ...rest } = this.props;

        if (!source) {
            return null;
        }

        return (
            <Table celled striped {...rest}>
                {
                    !!header && <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan={columns.length}>{header}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                }
                <Table.Body>
                    {
                        Object.keys(source).filter(key => !ignoreKeys.includes(key)).map((key, rowIndex) => {
                            const id = source.id;
                            const value = source[key];
                            return (
                                <Table.Row key={`${id}_${key}_${rowIndex}`}>
                                    {
                                        columns.map((cellDefinition, columnIndex) => {
                                            const columnKey = `${id}_${key}_${columnIndex}`;
                                            return (
                                                <ObjectTableCell key={columnKey}
                                                                 objectKey={key}
                                                                 objectValue={value}
                                                                 rowIndex={rowIndex}
                                                                 columnIndex={columnIndex}
                                                                 definition={cellDefinition} />
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
