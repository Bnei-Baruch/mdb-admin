import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import TabsMenu from '../shared/TabsMenu';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../shared/Splash';
import DetailsTab from './tabs/details/DetailsTab';
import DangerZoneTab from './tabs/danger/DangerZoneTab';

const tabs = [
  { name: 'Details', element: DetailsTab },
  { name: 'Danger Zone', element: DangerZoneTab },
];

const MainPage = (props) => {
  const { label, wip, err } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (label) {
    return <TabsMenu items={tabs} {...props} />;
  }

  return wip
    ? <LoadingSplash text="Loading label details" subtext="Hold on tight..." />
    : (
      <FrownSplash
        text="Couldn't find label"
        subtext={<span>Try the <Link to="/labels">labels list</Link>...</span>}
      />
    );
};

MainPage.propTypes = {
  label: PropTypes.object,
  wip: PropTypes.bool,
  err: shapes.Error,
};

MainPage.defaultProps = {
  label: null,
  wip: false,
  err: null,
};

export default MainPage;
