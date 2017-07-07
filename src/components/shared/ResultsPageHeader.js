import React from 'react';
import PropTypes from 'prop-types';

import { PAGE_SIZE } from '../../helpers/consts';

const ResultsPageHeader = (props) => {
  const { pageNo, pageSize, total } = props;

  if (total === 0) {
    return <span>No results</span>;
  }

  if (total <= pageSize) {
    return <span><strong>1 - {total}</strong>&nbsp; of <strong>{total}</strong>&nbsp;</span>;
  }

  return (
    <span>
      <strong>{((pageNo - 1) * pageSize) + 1} - {Math.min(total, pageNo * pageSize)}</strong>&nbsp;
      of <strong>{total}</strong>&nbsp;
    </span>
  );
};

ResultsPageHeader.propTypes = {
  pageNo: PropTypes.number,
  pageSize: PropTypes.number,
  total: PropTypes.number,
};

ResultsPageHeader.defaultProps = {
  pageNo: 1,
  pageSize: PAGE_SIZE,
  total: 0,
};

export default ResultsPageHeader;
