import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import { CONTENT_TYPE_BY_ID } from '../../helpers/consts.js';
import values from 'lodash/values';

const options = values(CONTENT_TYPE_BY_ID).map((value, key) => ({ key, value, text: value }));

function ContentTypeFilter(props) {
    const { onChange, value } = props;

    return (
        <Dropdown placeholder="Content Type"
                  value={value}
                  onChange={(event, data) => onChange(data.value)}
                  options={options}
                  multiple search selection />
    );
}

ContentTypeFilter.defaultProps = {
    value: []
};

export default ContentTypeFilter;
