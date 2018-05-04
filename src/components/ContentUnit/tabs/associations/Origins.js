import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Header, Icon, List, Menu, Message, Segment } from 'semantic-ui-react';

import { selectors } from '../../../../redux/modules/content_units';
import { selectors as system } from '../../../../redux/modules/system';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY, EMPTY_OBJECT, SECURITY_LEVELS } from '../../../../helpers/consts';

class Origins extends Component {

  static propTypes = {
    cuds: PropTypes.arrayOf(shapes.ContentUnitDerivation),
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    cuds: EMPTY_ARRAY,
    wip: false,
    err: null,
  };

  render() {
    const { cuds, wip, err } = this.props;

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (cuds.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading origins" /> :
        <Message>No origins found for this unit</Message>;
    } else {
      content = (
        <List divided relaxed>
          {
            cuds.map((x) => {
              const {
                      id,
                      uid,
                      type_id: typeID,
                      i18n,
                      secure,
                      published,
                      properties,
                    }                                                  = x.content_unit;
              const { duration, film_date: filmDate, currentLanguage } = properties || {};
              const name                                               = extractI18n(i18n, ['name'], currentLanguage)[0];
              const type                                               = CONTENT_TYPE_BY_ID[typeID];

              return (
                <List.Item key={id}>
                  <List.Content>
                    <List.Header>
                      <Link to={`/content_units/${id}`}>{name || uid}</Link>
                    </List.Header>
                    <List.Description>
                      <List horizontal>
                        <List.Item>{titleize(type)}</List.Item>
                        <List.Item>{filmDate}</List.Item>
                        {
                          duration ?
                            <List.Item>
                              {moment.utc(moment.duration(duration, 's').asMilliseconds()).format('HH:mm:ss')}
                            </List.Item>
                            : null
                        }
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
        </List>);
    }

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Origins" size="medium" color="blue" />
          </Menu.Item>
        </Menu>
        <Segment attached>
          {content}
        </Segment>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT } = ownProps;
  const cuIDs                   = unit.origins;
  const denormCUDs              = selectors.denormCUDs(state.content_units);
  return {
    cuds: cuIDs ? denormCUDs(cuIDs) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemOrigins'),
    err: selectors.getError(state.content_units, 'fetchItemOrigins'),
    currentLanguage: system.getCurrentLanguage(state.system),
  };
};

export default connect(mapState)(Origins);
