import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Icon, Input, Button } from 'semantic-ui-react';

class TextFilter extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        debounce: PropTypes.number
    };

    static defaultProps = {
        value: '',
        placeholder: '',
        debounce: 300
    };

    state = {
        value: this.props.value || ''
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    onChange = debounce((value) => {
        this.props.onChange(value);
    }, this.props.debounce);

    handleInputChange = (event) => {
        this.setState({ value: event.target.value }, () => this.onChange(this.state.value));
    };

    render() {
        const { onChange, placeholder } = this.props;

        return (
                <Input className="prompt"
                    type="text"
                    placeholder={placeholder}
                    value={this.state.value}
                    onChange={this.handleInputChange}
                    icon
                    iconPosition="left"
                    fluid>
                    <input />
                    <Icon name="search" inverted circular />
                    { this.state.value !== '' &&
                        <Button type="button" icon="remove" onClick={() => onChange('')} floated="right" />
                    }
                </Input>
        );
    }
}

export default TextFilter;
