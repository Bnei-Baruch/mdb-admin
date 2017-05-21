import React from 'react';
import { Icon, Input, Button } from 'semantic-ui-react';

function TextFilter(props) {
    const { onChange, value, placeholder } = props;

    return (
            <Input className="prompt"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                icon
                iconPosition="left"
                fluid>
                <input />
                <Icon name="search" inverted circular />
                { value !== '' &&
                    <Button type="button" icon="remove" onClick={() => onChange('')} floated="right" />
                }
            </Input>
    );
}

TextFilter.defaultProps = {
    value: ''
};

export default TextFilter;
