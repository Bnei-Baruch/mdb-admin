import React from 'react';
import values from 'lodash/values';
import { Dropdown, Button } from 'semantic-ui-react'
import { CONTENT_TYPE_BY_ID } from '../../helpers/consts.js';
import './ContentTypeFilter.css';

const options = values(CONTENT_TYPE_BY_ID).map((value, key) => ({ key, value, text: value }));

const emptyValue = [];

function ContentTypeFilter(props) {
    const { onChange, value } = props;

    return (
        <div className="ContentTypeFilter">
            <Dropdown placeholder="Content Type"
                    value={value}
                    onChange={(event, data) => onChange(data.value)}
                    options={options}
                    multiple search selection fluid />
            { value && value.length > 0 &&
                <Button type="button" icon="remove" onClick={() => onChange(emptyValue)} floated="right" />
            }
        </div>
    );
}

ContentTypeFilter.defaultProps = {
    value: []
};

export default ContentTypeFilter;
