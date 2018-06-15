import React from 'react';
import PropTypes from 'prop-types';

import { DateRangeFilter } from './filterComponents';

const DateRange = props => {
  const { namespace, onFilterApplication, isUpdateQuery, onFilterCancel } = props;
  return (<DateRangeFilter
    namespace={namespace}
    name="date-range-filter"
    onApply={onFilterApplication}
    onCancel={onFilterCancel}
    isUpdateQuery={isUpdateQuery} />);
};

DateRange.propTypes = {
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

export default DateRange;

