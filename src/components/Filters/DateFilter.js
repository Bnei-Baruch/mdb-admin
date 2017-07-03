import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import { Input, Icon, Button } from 'semantic-ui-react';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import connectFilter from './connectFilter';
import 'react-datepicker/dist/react-datepicker.css';
import './DateFilter.css';

const format = 'YYYY-MM-DD';

class DateFilter extends Component {

    static propTypes = {
        updateValue: PropTypes.func.isRequired,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        onApply: PropTypes.func.isRequired,
        minDate: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date)
        ]),
        maxDate: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date)
        ])
    };

    static defaultProps = {
        value: '',
        placeholder: 'YYYY-MM-DD'
    };

    apply = (value) => {
        this.props.updateValue(value);
        this.props.onApply();
    }
    
    render() {
        const { value, placeholder, minDate, maxDate, ...rest } = this.props;

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
                                <Button type="button" icon="remove" onClick={() => this.apply('')} floated="right" />
                            }
                        </Input>
                    }

                    minDate={momentMinDate}
                    maxDate={momentMaxDate}
                    dateFormat={format}
                    value={value}
                    onChange={(moment) => this.apply(moment.format(format))}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText={placeholder}
                    {...rest} 
                />
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const { namespace, before, after } = ownProps;
        
        // FUTURE: (yaniv) handle before and after being valid dates instead of a filter name
        let minDate; 
        let maxDate;
        if (before) {
            maxDate = filterSelectors.getLastFilterValue(state.filters, namespace, before);
        }

        if (after) {
            minDate = filterSelectors.getLastFilterValue(state.filters, namespace, after);
        }

        return {
            minDate,
            maxDate
        };
    }
)
(connectFilter()(DateFilter));
