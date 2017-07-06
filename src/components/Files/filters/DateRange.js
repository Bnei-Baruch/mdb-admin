import React from 'react';
import PropTypes from 'prop-types';

import { NS_FILES } from '../../../helpers/consts';
import { DateRangeFilter } from '../../Filters/filterComponents';

const DateRange = props => (
  <DateRangeFilter
    namespace={NS_FILES}
    name="date-range-filter"
    onApply={props.onFilterApplication}
  />
);

DateRange.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default DateRange;

