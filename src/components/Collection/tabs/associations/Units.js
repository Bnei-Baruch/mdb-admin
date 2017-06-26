import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { formatError } from '../../../../helpers/utils';

class Units extends Component {

  static propTypes = {
    getContentUnitById: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  static defaultProps = {
    collection: undefined,
  };

  render() {
    const {
            collection = {},
            getContentUnitById,
            getWIP,
            getError
          }           = this.props;
    const wip         = getWIP('fetchItemCollections');
    const err         = getError('fetchItemCollections');
    const units = (collection.units || []);

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
              const unit = getContentUnitById(x.content_unit);
              return (
                <List.Item key={unit.id}>
                  <Link to={`/content_units/${unit.id}`}>{unit.uid} [name: {x.name}]</Link>
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
            <Header content="Content Units" size="medium" color="blue" />
          </Menu.Item>
        </Menu>
        <Segment attached>
          {content}
        </Segment>
      </div>
    );
  }
}

export default Units;
