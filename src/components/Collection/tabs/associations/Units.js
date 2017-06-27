import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Header, Icon, List, Menu, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY, SECURITY_LEVELS } from '../../../../helpers/consts';

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
      <List divided relaxed>
        {
          units.map((x) => {
            const { name: ccuName, content_unit: unit }                    = x;
            const { type_id: typeID, i18n, secure, published, properties } = unit;
            const name                                                     = extractI18n(i18n, ['name'])[0];
            const type                                                     = CONTENT_TYPE_BY_ID[typeID];

            let durationDisplay = null;
            if (properties && properties.duration) {
              durationDisplay = moment.utc(moment.duration(properties.duration, 's').asMilliseconds()).format('HH:mm:ss');
            }

            return (
              <List.Item key={unit.id}>
                <List.Content>
                  <List.Header>
                    <Link to={`/content_units/${unit.id}`}>{name || unit.uid}</Link>
                  </List.Header>
                  <List.Description>
                    <List horizontal>
                      <List.Item>{titleize(type)}</List.Item>
                      <List.Item>{ccuName}</List.Item>
                      <List.Item>{durationDisplay}</List.Item>
                      <List.Item>
                        <Header
                          size="tiny"
                          content={SECURITY_LEVELS[secure].text}
                          color={SECURITY_LEVELS[secure].color}
                        />
                      </List.Item>
                      <List.Item>
                        {
                          published ?
                            <Icon name="checkmark" color="green" /> :
                            <Icon name="ban" color="red" />
                        }
                      </List.Item>
                    </List>
                  </List.Description>
                </List.Content>
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
