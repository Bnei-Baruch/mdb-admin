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

const MainPage = (props) => {
  const { collection, wip, err } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (!collection) {
    return wip ?
      <LoadingSplash text="Loading collection details" subtext="Hold on tight..." /> :
      <FrownSplash
        text="Couldn't find collection"
        subtext={<span>Try the <Link to="/collections">collections list</Link>...</span>}
      />;
  }

  const items = [
    {
      name: 'details',
      label: 'Details',
      component: <DetailsTab collection={collection} />,
    },
    {
      name: 'associations',
      label: 'Associations',
      component: <AssociationsTab collection={collection} />,
    },
    {
      name: 'danger',
      label: 'Danger Zone',
      component: <DangerZoneTab collection={collection} />,
    },
  ];

  return <TabsMenu items={items} />;
};

MainPage.propTypes = {
  collection: shapes.Collection,
  wip: PropTypes.bool,
  err: shapes.Error,
};

MainPage.defaultProps = {
  collection: null,
  wip: false,
  err: null,
};

export default MainPage;
