import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Header, Icon, List, Menu, Message, Segment } from 'semantic-ui-react';

import { selectors } from '../../../../redux/modules/content_units';
import { actions as collectionActions, selectors as collections } from '../../../../redux/modules/collections';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY, EMPTY_OBJECT, SECURITY_LEVELS } from '../../../../helpers/consts';

import NewCollections from './CollectionModal/Container';

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

  state = {
    isShowAssociateModal: false
  };

  handleShowAssociateModal = () => {
    this.setState({ isShowAssociateModal: !this.state.isShowAssociateModal });
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
        <List divided relaxed>
          {
            ccus.map((x) => {
              const { collection } = x;
              const {
                      id,
                      uid,
                      type_id: typeID,
                      i18n,
                      secure,
                      published,
                      properties,
                    }              = collection;
              const name           = extractI18n(i18n, ['name'])[0];
              const type           = CONTENT_TYPE_BY_ID[typeID];
              const filmDate       = (properties || {}).film_date;
              const number         = (properties || {}).number;

              return (
                <List.Item key={id}>
                  <List.Content>
                    <List.Header>
                      <Link to={`/collections/${id}`}>{name || uid}</Link>
                    </List.Header>
                    <List.Description>
                      <List horizontal>
                        <List.Item>{titleize(type)}</List.Item>
                        <List.Item>{number}</List.Item>
                        <List.Item>{filmDate}</List.Item>
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
            <Header content="Collections" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.handleShowAssociateModal}>
              <Icon name="plus" /> Add Collections
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Segment attached>
          {content}
          <NewCollections
            {...this.props}
            handleShowAssociateModal={this.handleShowAssociateModal}
            isShowAssociateModal={this.state.isShowAssociateModal} />
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
    associatedCIds: collectionIDs ? collectionIDs.map(c => c.collection_id) : [],
    ccus: collectionIDs ? denormCCUs(collectionIDs) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemCollections'),
    err: selectors.getError(state.content_units, 'fetchItemCollections'),
    wipAssociate: collections.getWIP(state.collections, 'associateUnit'),
    errAssociate: collections.getError(state.collections, 'associateUnit'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    associate: collectionActions.associateUnit,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(Collections);
