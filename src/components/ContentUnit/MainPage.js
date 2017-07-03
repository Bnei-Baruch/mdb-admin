import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as shapes from '../shapes';
import TabsMenu from '../shared/TabsMenu';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../shared/Splash';
import { formatError } from '../../helpers/utils';
import DetailsTab from './tabs/details/DetailsTab';
import AssociationsTab from './tabs/associations/AssociationsTab';
import FilesTab from './tabs/files/FilesTab';
import DangerZoneTab from './tabs/danger/DangerZoneTab';

const items = [
  { name: 'Details', element: DetailsTab },
  { name: 'Files', element: FilesTab },
  { name: 'Associations', element: AssociationsTab },
  { name: 'Danger Zone', element: DangerZoneTab },
];

const MainPage = (props) => {
  const { unit, wip, err } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (unit) {
    return <TabsMenu items={items} unit={unit} />;
  }

  return wip ?
    <LoadingSplash text="Loading content unit details" subtext="Hold on tight..." /> :
    <FrownSplash
      text="Couldn't find content unit"
      subtext={<span>Try the <Link to="/content_units">content units list</Link>...</span>}
    />;
};

MainPage.propTypes = {
  unit: shapes.ContentUnit,
  wip: PropTypes.bool,
  err: shapes.Error,
};

MainPage.defaultProps = {
  unit: null,
  wip: false,
  err: null,
};

export default MainPage;
