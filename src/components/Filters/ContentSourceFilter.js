import React, { Component } from 'react';
import PropTypes from 'prop-types';
import values from 'lodash/values';
import { Dropdown } from 'semantic-ui-react'
import connectFilter from './connectFilter';
import { SOURCE_TYPE_BY_ID } from '../../helpers/consts.js';

// TODO (yaniv): add empty value button after we pull the kolman's working filter

const options = values(SOURCE_TYPE_BY_ID).map((value, key) => ({ key, value, text: value }));

class ContentSourceFilter extends Component {

    static propTypes = {
        updateValue: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.string),
    };

    static defaultProps = {
        value: []
    };

    render() {
        const { updateValue, value } = this.props;

        return (
            <Dropdown 
                placeholder="Content Source"
                value={value}
                onChange={(event, data) => updateValue(data.value)}
                options={options}
                multiple search selection 
            />
        );
    }
}

export default connectFilter()(ContentSourceFilter);

