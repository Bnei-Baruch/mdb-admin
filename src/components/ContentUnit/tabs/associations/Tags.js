import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { extractI18n, formatError } from '../../../../helpers/utils';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';

class Tags extends Component {

  static propTypes = {
    getTagById: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: undefined,
  };

  render() {
    const {
            unit = {},
            getTagById,
            getWIP,
            getError
          }    = this.props;
    const wip  = getWIP('fetchItemTags');
    const err  = getError('fetchItemTags');
    const tags = (unit.tags || []).map(x => getTagById(x));

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (tags.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading tags" /> :
        <Message>No tags found for this unit</Message>;
    } else {
      content = (
        <List relaxed divided className="rtl-dir">
          {
            tags.map((x) => {
              const label = extractI18n(x.i18n, ['label'])[0];
              return (
                <List.Item key={x.id}>
                  <Link to={`/tags/${x.id}`}>{label}</Link>
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
            <Header content="Tags" size="medium" color="blue" />
          </Menu.Item>
        </Menu>
        <Segment attached>
          {content}
        </Segment>
      </div>
    );
  }

}

export default Tags;
