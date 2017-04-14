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

export default function columnCell(CellComponent) {
    return class ColumnCell extends PureComponent {
        static propTypes = {
            cellKey: PropTypes.any.isRequired,
            cellValue: PropTypes.any,
        };

        render() {
            const { cellKey, cellValue, ...rest } = this.props;
            const Component = isString(CellComponent) ? basicCell(CellComponent) : CellComponent;

            return (
                <Component
                    cellKey={cellKey}
                    cellValue={cellValue}
                    {...rest} />
            );
        }
    };
}