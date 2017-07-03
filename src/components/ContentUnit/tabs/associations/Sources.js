import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import { actions, selectors } from '../../../../redux/modules/content_units';
import { selectors as sourcesSelectors } from '../../../../redux/modules/sources';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import SourcesSearch from '../../../Autocomplete/SourcesSearch';
import SourceBreadcrumbs from '../../../Sources/SourceBreadcrumbs';

class Sources extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    addSource: PropTypes.func.isRequired,
    removeSource: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(shapes.Source),
    status: shapes.AsyncStatusMap,
  };

  static defaultProps = {
    sources: EMPTY_ARRAY,
    status: EMPTY_OBJECT,
  };

  addSource = (source) => {
    const { unit, sources, addSource } = this.props;
    if (sources.findIndex(x => x.id === source.id) === -1) {
      addSource(unit.id, source.id);
    }
  };

  removeSource = (source) => {
    const { unit, removeSource } = this.props;
    removeSource(unit.id, source.id);
  };

  renderStatusMessage() {
    const { status } = this.props;

    if (status.addSource.wip) {
      return <Header content="Adding Source..." icon={{ name: 'spinner', loading: true }} size="tiny" />;
    } else if (status.removeSource.wip) {
      return <Header content="Removing Source..." icon={{ name: 'spinner', loading: true }} size="tiny" />;
    }

    const err = status.addSource.err || status.removeSource.err;
    if (err) {
      return <Header content={formatError(err)} icon={{ name: 'warning sign' }} color="red" size="tiny" />;
    }

    return null;
  }

  render() {
    const { sources, status } = this.props;
    const { wip, err }        = status.fetchItemSources;

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (sources.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading sources" /> :
        <Message>No sources found for this unit</Message>;
    } else {
      content = (
        <List relaxed divided className="rtl-dir">
          {
            sources.map(x =>
              (
                <List.Item key={x.id}>
                  <List.Content floated="left">
                    <Button
                      circular
                      compact
                      size="mini"
                      icon="remove"
                      color="red"
                      inverted
                      onClick={() => this.removeSource(x)}
                    />
                  </List.Content>
                  <List.Content>
                    <SourceBreadcrumbs source={x} lastIsLink />
                  </List.Content>
                </List.Item>
              )
            )
          }
        </List>
      );
    }

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Sources" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <SourcesSearch placeholder="הוסף מקור" onSelect={this.addSource} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Segment attached>
          {content}
          {this.renderStatusMessage()}
        </Segment>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT } = ownProps;
  const sourceIDs               = unit.sources;
  const denormIDs               = sourcesSelectors.denormIDs(state.sources);

  const status = ['fetchItemSources', 'addSource', 'removeSource']
    .reduce((acc, val) => {
      acc[val] = {
        wip: selectors.getWIP(state.content_units, val),
        err: selectors.getError(state.content_units, val),
      };
      return acc;
    }, {});

  return {
    status,
    sources: sourceIDs ? denormIDs(sourceIDs) : EMPTY_ARRAY,
  };
};

const mapDispatch = dispatch => bindActionCreators({
  addSource: actions.addSource,
  removeSource: actions.removeSource,
}, dispatch);

export default connect(mapState, mapDispatch)(Sources);
