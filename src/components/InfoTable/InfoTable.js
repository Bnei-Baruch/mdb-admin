import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { Table } from 'semantic-ui-react';

function keyCell(key) {
    return key;
}

function valueCell(key, value) {
    return value;
}

const basicTransform = (transformName) => {
    switch (transformName) {
        case 'key':
            return keyCell;
        case 'value':
            return valueCell;
        default:
            throw new Error(`no basic transform named ${transformName}`);
    }
}

export default class InfoTable extends PureComponent {

    static propTypes = {
        source: PropTypes.object.isRequired,
        cells: PropTypes.array.isRequired,
        header: PropTypes.string.isRequired
    };

    render() {
        const { cells, source, header } = this.props;

        return (
            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan={cells.length}>{header}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        Object.keys(source).map(key =>
                            <Table.Row key={key}>
                                {
                                    cells.map((transform, idx) => {



                                        return (
                                            <Table.Cell collapsing key={`${key}_${idx}`}>
                                                {
                                                    isString(transform)
                                                        ? basicTransform(transform)(key, source[key], idx)
                                                        : transform(key, source[key], idx) }
                                            </Table.Cell>
                                        );
                                    })
                                }
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        );
    }

}
