import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import { selectors } from '../../../../redux/modules/content_units';
import { selectors as sourcesSelectors } from '../../../../redux/modules/sources';
import * as shapes from '../../../shapes';
import { formatError } from '../../../../helpers/utils';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import SourceBreadcrumb from '../../../Sources/SourceBreadcrumb';

class Sources extends Component {

  static propTypes = {
    sources: PropTypes.arrayOf(shapes.Source),
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    sources: EMPTY_ARRAY,
    wip: false,
    err: null,
  };

  render() {
    const { sources, wip, err } = this.props;

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
                  <SourceBreadcrumb source={x} lastSourceIsLink />
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
  const sourceIDs               = unit.sources;
  const denormIDs               = sourcesSelectors.denormIDs(state.sources);
  return {
    sources: sourceIDs ? denormIDs(sourceIDs) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemSources'),
    err: selectors.getError(state.content_units, 'fetchItemSources'),
  };
};

export default connect(mapState)(Sources);
