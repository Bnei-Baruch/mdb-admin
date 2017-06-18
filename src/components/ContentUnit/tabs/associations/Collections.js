import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { formatError } from '../../../../helpers/utils';

class Collections extends Component {

  static propTypes = {
    getCollectionById: PropTypes.func.isRequired,
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
            getCollectionById,
            getWIP,
            getError
          }           = this.props;
    const wip         = getWIP('fetchItemCollections');
    const err         = getError('fetchItemCollections');
    const collections = (unit.collections || []);

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (collections.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading collections" /> :
        <Message>No collections found for this unit</Message>;
    } else {
      content = (
        <List>
          {
            collections.map((x) => {
              const collection = getCollectionById(x.collection);
              return (
                <List.Item key={collection.id}>
                  <Link to={`/collections/${collection.id}`}>{collection.uid} [name: {x.name}]</Link>
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
            <Header content="Collections" size="medium" color="blue" />
          </Menu.Item>
        </Menu>
        <Segment attached>
          {content}
        </Segment>
      </div>
    );
  }
}

export default Collections;
