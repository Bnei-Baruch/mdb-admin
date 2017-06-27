import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, List, Menu, Message, Segment } from 'semantic-ui-react';

import { selectors } from '../../../../redux/modules/content_units';
import { selectors as tagsSelectors } from '../../../../redux/modules/tags';
import * as shapes from '../../../shapes';
import { extractI18n, formatError } from '../../../../helpers/utils';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';

class Tags extends Component {

  static propTypes = {
    tags: PropTypes.arrayOf(shapes.Tag),
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    tags: EMPTY_ARRAY,
    wip: false,
    err: null,
  };

  render() {
    const { tags, wip, err } = this.props;

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

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT } = ownProps;
  const tagIDs                  = unit.tags;
  const denormIDs               = tagsSelectors.denormIDs(state.tags);
  return {
    tags: tagIDs ? denormIDs(tagIDs) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.content_units, 'fetchItemTags'),
    err: selectors.getError(state.content_units, 'fetchItemTags'),
  };
};

export default connect(mapState)(Tags);
