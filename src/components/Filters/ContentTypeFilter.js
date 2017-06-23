import React, { Component } from 'react';
import PropTypes from 'prop-types';
import values from 'lodash/values';
import { Dropdown, Button } from 'semantic-ui-react'
import { CONTENT_TYPE_BY_ID } from '../../helpers/consts.js';
import connectFilter from './connectFilter';
import './ContentTypeFilter.css';

const options = values(CONTENT_TYPE_BY_ID).map((value, key) => ({ key, value, text: value }));

const emptyValue = [];

class ContentTypeFilter extends Component {

    static propTypes = {
        updateValue: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.string),
    }

    static defaultProps = {
        value: []
    };
    
    render() {
        const { updateValue, value } = this.props;

        return (
            <div className="ContentTypeFilter">
                <Dropdown 
                    placeholder="Content Type"
                    value={value}
                    onChange={(event, data) => updateValue(data.value)}
                    options={options}
                    multiple search selection fluid 
                />
                { value && value.length > 0 &&
                    <Button type="button" icon="remove" onClick={() => updateValue(emptyValue)} floated="right" />
                }
            </div>
        );
    }
}

export default connectFilter()(ContentTypeFilter);
