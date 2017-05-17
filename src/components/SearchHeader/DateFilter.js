import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Input, Icon } from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';

const format = 'YYYY-MM-DD';

function DateFilter(props) {
    const { onChange, value, placeholder, minDate, maxDate, ...rest } = props;

    const momentMinDate = minDate && moment(minDate, format);
    const momentMaxDate = maxDate && moment(maxDate, format);

    return (
        <DatePicker
            customInput={
                <Input icon placeholder={placeholder}>
                    <Icon name="calendar" />
                    <input />
                </Input>
            }
            minDate={momentMinDate}
            maxDate={momentMaxDate}
            dateFormat={format}
            value={value}
            onChange={(moment) => onChange(moment.format(format))}
            showYearDropdown
            showMonthDropdown
            {...rest} />
    );
}

DateFilter.defaultProps = {
    value: '',
};

export default DateFilter;
