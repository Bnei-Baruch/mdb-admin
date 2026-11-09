import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button, Header, List, Menu, Message, Segment
} from 'semantic-ui-react';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { actions, selectors } from '../../../../redux/modules/content_units';
import { selectors as tagsSelectors } from '../../../../redux/modules/tags';
import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import TagsSearch from '../../../Autocomplete/TagsSearch';
import TagBreadcrumbs from '../../../Tags/TagBreadcrumbs';

class Tags extends Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    addTag: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(shapes.Tag),
    status: shapes.AsyncStatusMap,
  };

  static defaultProps = {
    tags: EMPTY_ARRAY,
    status: EMPTY_OBJECT,
  };

  addTag = (tag) => {
    const { unit, tags, addTag } = this.props;
    if (tags.findIndex(x => x.id === tag.id) === -1) {
      addTag(unit.id, tag.id);
    }
  };

  removeTag = (tag) => {
    const { unit, removeTag } = this.props;
    removeTag(unit.id, tag.id);
  };

  renderStatusMessage() {
    const { status } = this.props;

    if (status.addTag.wip) {
      return (
        <Header
          content="Adding Tag..."
          icon={{ name: 'spinner', loading: true }}
          size="tiny"
        />
      );
    }

    if (status.removeTag.wip) {
      return (
        <Header
          content="Removing Tag..."
          icon={{ name: 'spinner', loading: true }}
          size="tiny"
        />
      );
    }

    const err = status.addTag.err || status.removeTag.err;
    if (err) {
      return (
        <Header
          content={formatError(err)}
          icon={{ name: 'warning sign' }}
          color="red"
          size="tiny"
        />
      );
    }

    return null;
  }

  render() {
    const { tags, status } = this.props;
    const { wip, err }     = status.fetchItemTags;

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (tags.length === 0) {
      content = wip
        ? <LoadingSplash text="Loading tags" />
        : <Message>No tags found for this unit</Message>;
    } else {
      content = (
        <List relaxed divided className="rtl-dir">
          {
            tags.map(x => (
              <List.Item key={x.id}>
                <List.Content floated="left">
                  <Button
                    circular
                    compact
                    size="mini"
                    icon="remove"
                    color="red"
                    inverted
                    onClick={() => this.removeTag(x)}
                  />
                </List.Content>
                <List.Content>
                  <TagBreadcrumbs tag={x} lastIsLink />
                </List.Content>
              </List.Item>
            ))
          }
        </List>
      );
    }

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Tags" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <TagsSearch placeholder="הוסף תגית" onSelect={this.addTag} />
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
  const tagIDs                  = unit.tags;
  const denormIDs               = tagsSelectors.denormIDs(state.tags);

  const status = ['fetchItemTags', 'addTag', 'removeTag']
    .reduce((acc, val) => {
      acc[val] = {
        wip: selectors.getWIP(state.content_units, val),
        err: selectors.getError(state.content_units, val),
      };
      return acc;
    }, {});

  return {
    status,
    tags: tagIDs ? denormIDs(tagIDs) : EMPTY_ARRAY,
  };
};

const mapDispatch = dispatch => bindActionCreators({
  addTag: actions.addTag,
  removeTag: actions.removeTag,
}, dispatch);

export default connect(mapState, mapDispatch)(Tags);
