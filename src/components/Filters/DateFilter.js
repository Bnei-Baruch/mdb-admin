import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Input, Icon, Button } from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import './DateFilter.css';

const format = 'YYYY-MM-DD';

function DateFilter(props) {
    const { onChange, value, placeholder, minDate, maxDate, ...rest } = props;

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
                            <Button type="button" icon="remove" onClick={() => onChange('')} floated="right" />
                        }
                    </Input>
                }

                minDate={momentMinDate}
                maxDate={momentMaxDate}
                dateFormat={format}
                value={value}
                onChange={(moment) => onChange(moment.format(format))}
                showYearDropdown
                showMonthDropdown
                placeholderText={placeholder}
                {...rest} />
        </div>
    );
}

DateFilter.defaultProps = {
    value: '',
};

export default DateFilter;
