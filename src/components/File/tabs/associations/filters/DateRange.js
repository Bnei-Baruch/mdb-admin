import React from 'react';
import PropTypes from 'prop-types';

import { NS_FILE_UNITS } from '../../../../../helpers/consts';
import { DateRangeFilter } from '../../../../Filters/filterComponents';

const DateRange = props => (
  <DateRangeFilter
    namespace={NS_FILE_UNITS}
    name="date-range-filter"
    onApply={props.onFilterApplication}
  />
);

DateRange.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default DateRange;

