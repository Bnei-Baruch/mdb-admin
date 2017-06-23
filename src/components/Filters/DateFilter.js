import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Input, Icon, Button } from 'semantic-ui-react';
import connectFilter from './connectFilter';
import 'react-datepicker/dist/react-datepicker.css';
import './DateFilter.css';

const format = 'YYYY-MM-DD';

class DateFilter extends Component {

    static propTypes = {
        updateValue: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.string),
        placeholder: PropTypes.string
    };

    static defaultProps = {
        value: '',
        placeholder: 'YYYY-MM-DD'
    };
    
    render() {
        const { updateValue, value, placeholder, minDate, maxDate, ...rest } = this.props;

        const momentMinDate = minDate && moment(minDate, format);
        const momentMaxDate = maxDate && moment(maxDate, format);

        return (
            <div className="DateFilter">
                <DatePicker
                    customInput={
                        <Input icon iconPosition="left" fluid>
                            <Icon name="calendar" circular />
                            <input />
                            { !!value &&
                                <Button type="button" icon="remove" onClick={() => updateValue('')} floated="right" />
                            }
                        </Input>
                    }

                    minDate={momentMinDate}
                    maxDate={momentMaxDate}
                    dateFormat={format}
                    value={value}
                    onChange={(moment) => updateValue(moment.format(format))}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText={placeholder}
                    {...rest} 
                />
            </div>
        );
    }
}

// TODO (yaniv): connect here to get minDate and maxDate from state maybe
export default connectFilter()(DateFilter);
