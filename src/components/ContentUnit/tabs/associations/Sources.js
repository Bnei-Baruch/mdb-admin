import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { formatError } from '../../../../helpers/utils';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import SourceBreadcrumb from '../../../Sources/SourceBreadcrumb';

class Sources extends Component {

  static propTypes = {
    getSourceById: PropTypes.func.isRequired,
    getAuthorByCollectionId: PropTypes.func.isRequired,
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
            getSourceById,
            getWIP,
            getError
          }       = this.props;
    const wip     = getWIP('fetchItemSources');
    const err     = getError('fetchItemSources');
    const sources = (unit.sources || []).map(x => getSourceById(x));

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
            sources.map((x) => {
              const props = Object.assign({}, this.props, { source: x, lastSourceIsLink: true });
              return (
                <List.Item key={x.id}>
                  <SourceBreadcrumb {...props} />
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

export default Sources;
