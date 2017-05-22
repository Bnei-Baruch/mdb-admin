import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import { SOURCE_TYPE_BY_ID } from '../../helpers/consts.js';
import values from 'lodash/values';

// TODO (yaniv): add empty value button after we pull the kolman's working filter

const options = values(SOURCE_TYPE_BY_ID).map((value, key) => ({ key, value, text: value }));

function ContentSourceFilter(props) {
    const { onChange, value } = props;

    return (
        <Dropdown placeholder="Content Source"
                  value={value}
                  onChange={(event, data) => onChange(data.value)}
                  options={options}
                  multiple search selection />
    );
}

ContentSourceFilter.defaultProps = {
    value: []
};

export default ContentSourceFilter;

