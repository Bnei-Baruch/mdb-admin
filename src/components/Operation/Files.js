import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { filesize } from 'filesize';
import { Link } from 'react-router-dom';
import {
  Flag, Header, Icon, List, Menu, Message, Segment
} from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import {
  EMPTY_ARRAY, EMPTY_OBJECT, LANG_UNKNOWN, LANGUAGES, SECURITY_LEVELS
} from '../../helpers/consts';
import { fileIcon, formatError } from '../../helpers/utils';
import { actions, selectors } from '../../redux/modules/operations';
import { selectors as filesSelectors } from '../../redux/modules/files';
import * as shapes from '../shapes';
import { ErrorSplash, LoadingSplash } from '../shared/Splash';

class Files extends Component {
  constructor(props) {
    super(props);
    const { files } = props;
    this.state      = Files.getStateFromFiles(files);
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.files) {
      return null;
    }

    const nextState = Files.getStateFromFiles(props.files);
    if (isEqual(state, nextState)) {
      return null;
    }
    if (state.currentFile) {
      delete nextState.currentFile;
    }
    return nextState;
  }

  static getStateFromFiles = files => (
    {
      total: files.length,
      files: [...files].sort(Files.cmpFiles),
    }
  );

  // compare files by "relevance"
  static cmpFiles = (a, b) => {
    // sort by created_at
    if (a.created_at < b.created_at) {
      return -1;
    }
    if (a.created_at > b.created_at) {
      return 1;
    }

    return 0;
  };

  // eslint-disable-next-line class-methods-use-this
  renderFile(file) {
    const {
            id,
            name,
            size,
            language,
            secure,
            published,
            properties,
          }               = file;
    const sizeDisplay     = filesize(size);
    const icon            = fileIcon(file);
    const lang            = LANGUAGES[language || LANG_UNKNOWN];
    const { duration }    = properties || {};
    const durationDisplay = duration ?
      moment.utc(moment.duration(properties.duration, 's').asMilliseconds()).format('HH:mm:ss') :
      null;

    return (
      <List.Item key={id}>
        <List.Icon name={icon} size="big" />
        <List.Content>
          <List.Header>
            <Link to={`/files/${id}`}>{name}</Link>
          </List.Header>
          <List.Description>
            <List horizontal>
              <List.Item>
                {
                  lang.flag ? <Flag name={lang.flag} /> : <strong>Language:&nbsp;</strong>
                }
                {lang.text}
              </List.Item>
              <List.Item>{sizeDisplay}</List.Item>
              {
                durationDisplay ?
                  <List.Item>{durationDisplay}</List.Item> :
                  null
              }
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
  }

  render() {
    const { wip, err } = this.props;

    if (err) {
      return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    }

    const { total, files } = this.state;

    let content;
    if (total === 0) {
      content = wip ?
        <LoadingSplash text="Loading files" subtext="We'll be here before you'll know it" /> :
        <Message>No files found for this operation</Message>;
    } else {
      content = (
        <List divided relaxed>
          {files.map(file => this.renderFile(file))}
        </List>
      );
    }

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content={`${files.length} Files`} color="blue" />
          </Menu.Item>
        </Menu>

        <Segment attached>
          {content}
        </Segment>
      </div>
    );
  }
}

Files.propTypes = {
  operation: shapes.Operation,
  files: PropTypes.arrayOf(shapes.File),
  wip: PropTypes.bool,
  err: shapes.Error,
};

Files.defaultProps = {
  operation: undefined,
  files: EMPTY_ARRAY,
  wip: false,
  err: null,
};

const mapState = (state, ownProps) => {
  const { operation = EMPTY_OBJECT } = ownProps;
  const fileIds                      = operation.files;
  const denormIDs                    = filesSelectors.denormIDs(state.files);
  return {
    files: fileIds ? denormIDs(fileIds) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.operations, 'fetchItemFiles'),
    err: selectors.getError(state.operations, 'fetchItemFiles'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({ fetchItemFiles: actions.fetchItemFiles }, dispatch);
}

export default connect(mapState, mapDispatch)(Files);
