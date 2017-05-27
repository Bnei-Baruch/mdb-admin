import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Input, Icon, Button } from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import './DateFilter.css';

const format = 'YYYY-MM-DD';

const valueToMoment = value => (value ? moment(value, format) : null);

class DateFilter extends Component {
    static defaultProps = {
        value: '',
    };

    state = {
        inputValue: this.props.value
    };

    componentDidMount() {
        this.setMinDate();
        this.setMaxDate();
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.value);
        this.setMinDate();
        this.setMaxDate();
        this.setState({
            inputValue: this.props.value
        });
    }

    setMinDate = () => this.momentMinDate = this.props.minDate && moment(this.props.minDate, format);

    setMaxDate = () => this.momentMaxDate = this.props.maxDate && moment(this.props.maxDate, format);

    handleChangeRaw = value => this.setState({ inputValue: value });

    handleChange = (momentValue) => {
        if (!momentValue) {
            this.props.onChange('');
        } else {
            this.props.onChange(momentValue.format(format));
        }
    };

    clearValue = () => this.handleChange(null);

    render() {
        const { onChange, value, placeholder, ...rest } = this.props;
        const momentValue = valueToMoment(value);

        return (
            <div className="DateFilter">
                <DatePicker
                    customInput={
                        <Input icon iconPosition="left" fluid>
                            <Icon name="calendar" circular />
                            <input />
                            { !!value &&
                                <Button type="button" icon="remove" onClick={this.clearValue} floated="right" />
                            }
                        </Input>
                    }

                    minDate={this.momentMinDate}
                    maxDate={this.momentMaxDate}
                    dateFormat={format}
                    selected={momentValue}
                    value={this.state.inputValue}
                    onChangeRaw={this.handleChangeRaw}
                    onChange={this.handleChange}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText={placeholder}
                    {...rest} />
            </div>
        );
    }
}

export default DateFilter;
