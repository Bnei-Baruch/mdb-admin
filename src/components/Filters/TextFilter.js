import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Button } from 'semantic-ui-react';
import connectFilter from './connectFilter';
import { CONTENT_TYPE_BY_ID} from '../../helpers/consts';

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

        let key = Object.keys(CONTENT_TYPE_BY_ID).find(key => CONTENT_TYPE_BY_ID[key] === value);
        if (key) {
            value = key;
        }

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
