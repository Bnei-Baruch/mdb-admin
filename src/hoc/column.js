import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';

const KeyCell = ({ cellKey }) => <div>{ cellKey }</div>;
const ValueCell = ({ cellValue }) => <div>{ cellValue }</div>;

const basicCell = (transformName) => {
    switch (transformName) {
        case 'key':
            return KeyCell;
        case 'value':
            return ValueCell;
        default:
            throw new Error(`no basic transform named ${transformName}`);
    }
};

export default function column(CellComponent) {
    return class Column extends PureComponent {
        static propTypes = {
            cellKey: PropTypes.any.isRequired,
            cellValue: PropTypes.any.isRequired,
        };

        render() {
            const { cellKey, cellValue, ...rest } = this.props;
            const component = isString(CellComponent) ? basicCell(CellComponent) : CellComponent;

            return (
                <component
                    cellKey={cellKey}
                    cellValue={cellValue}
                    {...rest} />
            );
        }
    };
}