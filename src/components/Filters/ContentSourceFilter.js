import React, { Component } from 'react';
import PropTypes from 'prop-types';
import values from 'lodash/values';
import { Dropdown } from 'semantic-ui-react'
import connectFilter from './connectFilter';
import { SOURCE_TYPE_BY_ID } from '../../helpers/consts.js';

const options = values(SOURCE_TYPE_BY_ID).map((value, key) => ({ key, value, text: value }));

class ContentSourceFilter extends Component {

    static propTypes = {
        updateValue: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.string),
        onApply: PropTypes.func.isRequired
    };

    static defaultProps = {
        value: []
    };

    apply = (value) => {
        this.props.updateValue(value);
        this.props.onApply();
    }

    render() {
        const { value } = this.props;

        return (
            <Dropdown 
                placeholder="Content Source"
                value={value}
                onChange={(event, data) => this.apply(data.value)}
                options={options}
                multiple search selection 
            />
        );
    }
}

export default connectFilter()(ContentSourceFilter);

