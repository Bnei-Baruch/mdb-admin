import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { formatError } from '../../../../helpers/utils';
import { EMPTY_ARRAY } from '../../../../helpers/consts';

const Units = (props) => {
  const { units, wip, err } = props;

  let content;
  if (err) {
    content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  } else if (units.length === 0) {
    content = wip ?
      <LoadingSplash text="Loading content units" /> :
      <Message>No content units found for this collection</Message>;
  } else {
    content = (
      <List>
        {
          units.map((x) => {
            const { name, content_unit: unit } = x;
            return (
              <List.Item key={unit.id}>
                <Link to={`/content_units/${unit.id}`}>{unit.uid} [name: {name}]</Link>
              </List.Item>
            );
          })
        }
      </List>
    );
  }

  return (
    <div>
      <Menu attached borderless size="large">
        <Menu.Item header>
          <Header content="Content Units" size="medium" color="blue" />
        </Menu.Item>
      </Menu>
      <Segment attached>
        {content}
      </Segment>
    </div>
  );
};

Units.propTypes = {
  units: PropTypes.arrayOf(shapes.CollectionContentUnit),
  wip: PropTypes.bool,
  err: shapes.Error,
};

Units.defaultProps = {
  units: EMPTY_ARRAY,
  wip: false,
  err: null,
};

export default Units;
