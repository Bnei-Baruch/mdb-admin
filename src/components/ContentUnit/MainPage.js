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

const MainPage = (props) => {
  const { unit, getWIP, getError } = props;
  const wip                        = getWIP('fetchItem');
  const err                        = getError('fetchItem');

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (!unit) {
    return wip ?
      <LoadingSplash text="Loading content unit details" subtext="Hold on tight..." /> :
      <FrownSplash
        text="Couldn't find content unit"
        subtext={<span>Try the <Link to="/content_units">content units list</Link>...</span>}
      />;
  }

  const items = [
    {
      name: 'details',
      label: 'Details',
      component: <DetailsTab {...props} />,
    },
    {
      name: 'files',
      label: 'Files',
      component: <FilesTab {...props} />,
    },
    {
      name: 'associations',
      label: 'Associations',
      component: <AssociationsTab {...props} />,
    },
    {
      name: 'danger',
      label: 'Danger Zone',
      component: <DangerZoneTab {...props} />,
    },
  ];

  return <TabsMenu items={items} />;
};

MainPage.propTypes = {
  getWIP: PropTypes.func.isRequired,
  getError: PropTypes.func.isRequired,
  unit: shapes.ContentUnit,
};

MainPage.defaultProps = {
  unit: null,
};

export default MainPage;
