import React from 'react';
import PropTypes from 'prop-types';

import { Header, Label } from 'semantic-ui-react';
import { formatError } from '../../helpers/utils';

const ErrWip = (props) => {
  const { err, wip } = props;
  if (wip) {
    return <Label color="yellow" icon={{ name: 'spinner', loading: true }} content="Loading" />;
  }
  if (err) {
    return <Header as="span" inverted content={formatError(err)} color="red" icon="warning sign" />;
  }
  return null;
};

ErrWip.propTypes = {
  wip: PropTypes.any,
  err: PropTypes.any,
};

ErrWip.defaultProps = {
  wipText: 'Loading'
};

export default ErrWip;
