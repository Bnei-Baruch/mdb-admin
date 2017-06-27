import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import { selectors } from '../../../../redux/modules/content_units';
import { selectors as collections } from '../../../../redux/modules/collections';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { formatError } from '../../../../helpers/utils';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';

class Collections extends Component {

  static propTypes = {
    ccus: PropTypes.arrayOf(shapes.CollectionContentUnit),
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    ccus: EMPTY_ARRAY,
    wip: false,
    err: null,
  };

  render() {
    const { ccus, wip, err } = this.props;

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (ccus.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading collections" /> :
        <Message>No collections found for this unit</Message>;
    } else {
      content = (
        <List>
          {
            ccus.map((x) => {
              const { name, collection } = x;
              return (
                <List.Item key={collection.id}>
                  <Link to={`/collections/${collection.id}`}>{collection.uid} [name: {name}]</Link>
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

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT } = ownProps;
  const collectionIDs           = unit.collections;
  const denormCCUs              = collections.denormCCUs(state.collections);
  return {
    ccus: collectionIDs ? denormCCUs(collectionIDs) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemCollections'),
    err: selectors.getError(state.content_units, 'fetchItemCollections'),
  };
};

export default connect(mapState)(Collections);
