import React from 'react';
import PropTypes from 'prop-types';

import { DateRangeFilter } from './filterComponents';

const DateRange = props => (
  <DateRangeFilter
    namespace={props.namespace}
    name="date-range-filter"
    onApply={props.onFilterApplication}
    isUpdateQuery={true}
  />
);

DateRange.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default DateRange;

