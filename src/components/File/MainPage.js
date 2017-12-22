import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as shapes from '../shapes';
import TabsMenu from '../shared/TabsMenu';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../shared/Splash';
import { formatError } from '../../helpers/utils';
import DetailsTab from './tabs/details/DetailsTab';
import AssociationsTab from './tabs/associations/AssociationsTab';
import DangerZoneTab from './tabs/danger/DangerZoneTab';

const items = [
  { name: 'Details', element: DetailsTab },
  { name: 'Associations', element: AssociationsTab },
  { name: 'Danger Zone', element: DangerZoneTab },
];

const MainPage = (props) => {
  const { file, wip, err } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (file) {
    return <TabsMenu items={items} file={file} />;
  }

  return wip ?
    <LoadingSplash text="Loading file details" subtext="Hold on tight..." /> :
    <FrownSplash
      text="Couldn't find file"
      subtext={<span>Try the <Link to="/files">files list</Link>...</span>}
    />;
};

MainPage.propTypes = {
  file: shapes.File,
  wip: PropTypes.bool,
  err: shapes.Error,
};

MainPage.defaultProps = {
  file: null,
  wip: false,
  err: null,
};

export default MainPage;
