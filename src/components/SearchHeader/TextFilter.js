import React from 'react';
import classNames from 'classnames';
import { Icon, Input, Button, Label } from 'semantic-ui-react';

function TextFilter(props) {
    const { onChange, value, placeholder } = props;

    const removeIconClass = classNames(
        'remove icon',
        { 'invisible': value === '' }
    );

    return (
        <div>
            <Input className="prompt"
                   type="text"
                   placeholder={placeholder}
                   value={value}
                   onChange={(event) => onChange(event.target.value)}
                   icon>
                <input />
                <Icon name="search" inverted circular />
            </Input>
            { value !== '' && <Icon name="remove" circular onClick={() => onChange('')} /> }
        </div>
    );
}

TextFilter.defaultProps = {
    value: ''
};

export default TextFilter;
