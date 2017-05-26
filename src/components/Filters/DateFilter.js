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
        value: null//valueToMoment(this.props.value)
    };

    componentDidMount() {
        this.setMinDate();
        this.setMaxDate();
    }

    componentWillReceiveProps(nextProps) {
        this.setMinDate();
        this.setMaxDate();
        // this.setState({
        //     value: valueToMoment(this.props.value)
        // });
    }

    setMinDate = () => this.momentMinDate = this.props.minDate && moment(this.props.minDate, format);

    setMaxDate = () => this.momentMaxDate = this.props.maxDate && moment(this.props.maxDate, format);

    handleChange = (value) => {
        console.log(value);
        this.setState({ value });
    }

    render() {
        const { onChange, placeholder, ...rest } = this.props;
        return (
            <div className="DateFilter">
                <DatePicker
                    customInput={
                        <Input icon iconPosition="left" fluid>
                            <Icon name="calendar" circular />
                            <input />
                            { !!this.state.value &&
                                <Button type="button" icon="remove" onClick={() => onChange('')} floated="right" />
                            }
                        </Input>
                    }

                    minDate={this.momentMinDate}
                    maxDate={this.momentMaxDate}
                    dateFormat={format}
                    selected={this.state.value}
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
