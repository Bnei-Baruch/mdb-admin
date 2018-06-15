import React from 'react';
import PropTypes from 'prop-types';

import { formatError } from '../../helpers/utils';
import { Header, Label } from 'semantic-ui-react';

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
  wip: PropTypes.object.required,
  err: PropTypes.object.required,
};

ErrWip.defaultProps = {
  wipText: 'Loading'
};

export default ErrWip;
