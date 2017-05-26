import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Input, Icon, Button } from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import './DateFilter.css';

const format = 'YYYY-MM-DD';

class DateFilter extends Component {
    static defaultProps = {
        value: '',
    };

    state = {
        value: this.props.value
    };

    componentDidMount() {
        this.setMinDate();
        this.setMaxDate();
    }

    componentWillReceiveProps(nextProps) {
        this.setMinDate();
        this.setMaxDate();
        this.setState({
            value: this.props.value
        });
    }

    setMinDate = () => this.momentMinDate = this.props.minDate && moment(this.props.minDate, format);

    setMaxDate = () => this.momentMaxDate = this.props.maxDate && moment(this.props.maxDate, format);

    handleRawChange = (value) => {
        const momentValue = moment(value, format);

        if (momentValue.isValid()) {
            this.props.onChange(value);
        }
    };

    render() {
        const { onChange, placeholder, ...rest } = props;
        return (
            <div className="DateFilter">
                <DatePicker
                    customInput={
                        <Input icon iconPosition="left" fluid>
                            <Icon name="calendar" circular />
                            <input />
                            { !!value &&
                                <Button type="button" icon="remove" onClick={() => onChange('')} floated="right" />
                            }
                        </Input>
                    }

                    minDate={momentMinDate}
                    maxDate={momentMaxDate}
                    dateFormat={format}
                    value={value}
                    onRawChange={this.handleRawChange}
                    onChange={(moment) => onChange(moment.format(format))}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText={placeholder}
                    {...rest} />
            </div>
        );
    }
}

export default DateFilter;
