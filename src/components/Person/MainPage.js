import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as shapes from '../shapes';
import TabsMenu from '../shared/TabsMenu';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../shared/Splash';
import { formatError } from '../../helpers/utils';
import DetailsTab from './tabs/details/DetailsTab';
import DangerZoneTab from './tabs/danger/DangerZoneTab';

const tabs = [
  { name: 'Details', element: DetailsTab },
  { name: 'Danger Zone', element: DangerZoneTab },
];

const MainPage = (props) => {
  const { person, wip, err } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (person) {
    return <TabsMenu items={tabs} {...props} />;
  }

  return wip ?
    <LoadingSplash text="Loading content person details" subtext="Hold on tight..." /> :
    <FrownSplash
      text="Couldn't find content person"
      subtext={<span>Try the <Link to="/persons">content persons list</Link>...</span>}
    />;
};

MainPage.propTypes = {
  person: shapes.Person,
  wip: PropTypes.bool,
  err: shapes.Error,
};

MainPage.defaultProps = {
  person: null,
  wip: false,
  err: null,
};

export default MainPage;
