import React from 'react';
import PropTypes from 'prop-types';

import { NS_UNIT_ASSOCIATION_CU } from '../../../../../../helpers/consts';
import { DateRangeFilter } from '../../../../../Filters/filterComponents';

const DateRange = props => (
  <DateRangeFilter
    namespace={NS_UNIT_ASSOCIATION_CU}
    name="date-range-filter"
    onApply={props.onFilterApplication}
  />
);

DateRange.propTypes = {
  onFilterApplication: PropTypes.func.isRequired
};

export default DateRange;

