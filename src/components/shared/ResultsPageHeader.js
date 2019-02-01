import React from 'react';
import PropTypes from 'prop-types';

import { PAGE_SIZE } from '../../helpers/consts';

const ResultsPageHeader = (props) => {
  const { pageNo, pageSize, total } = props;
  let content                       = '';
  if (total === 0) {
    content = <span>No results</span>;
  } else if (total <= pageSize) {
    content = <span><strong>1 - {total}</strong>&nbsp; of <strong>{total}</strong>&nbsp;</span>;
  } else {
    content = (
      <span>
      <strong>{((pageNo - 1) * pageSize) + 1} - {Math.min(total, pageNo * pageSize)}</strong>&nbsp;
        of <strong>{total}</strong>&nbsp;
    </span>);
  }
  return <span style={{ padding: '0 10px' }}>{content}</span>;
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
