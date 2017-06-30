import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Button } from 'semantic-ui-react';
import connectFilter from './connectFilter';

class TextFilter extends Component {
    
    static propTypes = {
        updateValue: PropTypes.func.isRequired,
        value: PropTypes.string,
        onApply: PropTypes.func.isRequired
    };

    static defaultProps = {
        value: ''
    };

    apply = (value) => {
        this.props.updateValue(value);
        this.props.onApply();
    }

    render() {
        const { value, placeholder } = this.props;

        return (
                <Input 
                    className="prompt"
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => this.apply(event.target.value)}
                    icon
                    iconPosition="left"
                    fluid
                >
                    <input />
                    <Icon name="search" inverted circular />
                    { value !== '' &&
                        <Button type="button" icon="remove" onClick={() => this.apply('')} floated="right" />
                    }
                </Input>
        );
    }
}

export default connectFilter()(TextFilter);
