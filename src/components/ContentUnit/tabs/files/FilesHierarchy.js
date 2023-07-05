import classnames from 'classnames';
import filesize from 'filesize';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flag, Grid, Header, Icon, List, Menu, Message, Segment } from 'semantic-ui-react';

import {
  ALL_FILE_TYPES,
  ALL_LANGUAGES,
  EMPTY_ARRAY,
  LANG_UNKNOWN,
  LANGUAGES,
  SECURITY_LEVELS,
  JWPLAYER_ID
} from '../../../../helpers/consts';
import { buildHierarchy, fileIcon, fileTypes, formatError, physicalFile } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import './files.css';

const getStateFromFiles = (files) => {
  const total   = files.length;
  const cuFiles = new Set(files.map(x => x.id));

  const fileMap = new Map(files.map((x) => {
    // complement types if they're missing
    const f = { ...x, ...fileTypes(x) };

    // Note that if a file's parent doesn't belong to this content unit
    // we want it to be shown as root
    if (f.parent_id && !cuFiles.has(f.parent_id)) {
      f.parent_id = null;
    }

    return [f.id, f];
  }));

  // build and sort hierarchy
  const hierarchy = buildHierarchy(fileMap);
  hierarchy.byID  = fileMap;
  hierarchy.roots.sort((a, b) => cmpFiles(fileMap.get(a), fileMap.get(b)));
  hierarchy.childMap.forEach(v => v.sort((a, b) => cmpFiles(fileMap.get(a), fileMap.get(b))));

  // get first playable file
  const currentFile = bestPlayableFile(hierarchy);

  return { total, hierarchy, currentFile };
};
const bestPlayableFile  = (hierarchy) => {
  // We DFS the hierarchy tree for the best playable leaf node.
  let best = null;
  let s    = [...hierarchy.roots];
  while (s.length > 0) {
    const id       = s.shift();
    const children = hierarchy.childMap.get(id);
    if (Array.isArray(children)) {
      s = children.concat(s);
    } else {
      const file = hierarchy.byID.get(id);
      if (['audio', 'video'].includes(file.type)) {
        if (best) {
          if (cmpFiles(file, best) < 0) {
            best = file;
          }
        } else {
          best = file;
        }
      }
    }
  }

  return best;
};

// compare files by "relevance"
const cmpFiles = (a, b) => {
  // sort by published status
  if (a.published && !b.published) {
    return -1;
  }
  if (!a.published && b.published) {
    return 1;
  }

  // sort by lang
  const aLang    = a.language || LANG_UNKNOWN;
  const bLang    = b.language || LANG_UNKNOWN;
  const aLangIdx = ALL_LANGUAGES.findIndex(x => x === aLang);
  const bLangIdx = ALL_LANGUAGES.findIndex(x => x === bLang);
  if (aLangIdx < bLangIdx) {
    return -1;
  }
  if (aLangIdx > bLangIdx) {
    return 1;
  }

  // sort by type
  const aType    = a.type || ALL_FILE_TYPES[ALL_FILE_TYPES.length - 1];
  const bType    = b.type || ALL_FILE_TYPES[ALL_FILE_TYPES.length - 1];
  const aTypeIdx = ALL_FILE_TYPES.findIndex(x => x === aType);
  const bTypeIdx = ALL_FILE_TYPES.findIndex(x => x === bType);
  if (aTypeIdx < bTypeIdx) {
    return -1;
  }
  if (aTypeIdx > bTypeIdx) {
    return 1;
  }

  // sort by created_at
  if (a.created_at < b.created_at) {
    return -1;
  }
  if (a.created_at > b.created_at) {
    return 1;
  }

  return 0;
};

class FilesHierarchy extends Component {
  static;

  constructor(props) {
    super(props);
    const { files, unit: { id } } = props;
    this.state                    = { id, ...getStateFromFiles(files) };
  }

  static getDerivedStateFromProps(props, state) {
    const { unit: { id }, files } = props;
    if (id === state.id && state.total > 0)
      return null;

    return { id, ...getStateFromFiles(files) };
  }

  handleSwitchToAddFiles = () => this.props.setEditMode(true);

  handlePlay = (e, file) => {
    e.stopPropagation();
    if (['audio', 'video'].includes(file.type)) {
      this.setState({ currentFile: file });
      const src = physicalFile(file, true);
      window.jwplayer(JWPLAYER_ID).setup({ file: src, preload: 'auto' });
    }
  };

  handleDownload = (e, file) => {
    window.open(physicalFile(file), '_blank');
  };

  renderFile(file) {
    const { currentFile, hierarchy } = this.state;
    const { childMap }               = hierarchy;

    const { id, name, size, language, secure, published, properties, removed_at: removedAt } = file;
    const sizeDisplay                                                                        = filesize(size);
    const icon                                                                               = fileIcon(file);
    const lang                                                                               = LANGUAGES[language || LANG_UNKNOWN];
    const children                                                                           = childMap.get(id) || [];
    const { duration }                                                                       = properties || {};
    const durationDisplay                                                                    = duration ?
      moment.utc(moment.duration(properties.duration, 's').asMilliseconds()).format('HH:mm:ss') :
      null;

    return (
      <div key={id}>
        <Header
          size="small"
          className={classnames({
            'ccu-files-item': true,
            active: currentFile && id === currentFile.id
          })}
          onClick={e => this.handlePlay(e, file)}
        >
          <Icon name={icon} />
          <Header.Content>
            <Link to={`/files/${id}`} style={removedAt ? { textDecoration: 'line-through' } : null}>{name}</Link>
            <Header.Subheader>
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
            </Header.Subheader>
          </Header.Content>
        </Header>
        <div style={{ paddingLeft: '2rem' }}>
          {children.map(x => this.renderFile(hierarchy.byID.get(x)))}
        </div>
      </div>
    );
  }

  renderFiles = () => {
    const { hierarchy, currentFile } = this.state;
    return (
      <Segment attached>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <div>
                {hierarchy.roots.map(x => this.renderFile(hierarchy.byID.get(x)))}
              </div>
            </Grid.Column>
            <Grid.Column width={6} textAlign="center">
              {
                currentFile ? (
                    <div>
                      <div id={JWPLAYER_ID} />
                      <br />
                      <Button
                        content="Download"
                        icon="download"
                        color="orange"
                        onClick={e => this.handleDownload(e, currentFile)}
                      />
                    </div>
                  ) :
                  null
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  };

  render() {
    const { wip, err } = this.props;
    const { total }    = this.state;
    let content;

    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    }

    if (total === 0) {
      content = wip ?
        <LoadingSplash text="Loading files" subtext="We'll be here before you'll know it" /> :
        <Message>No files found for this unit</Message>;
    }

    return (
      <div>
        <Menu attached borderless size="large">
          {!content ? <Menu.Item>{total} files </Menu.Item> : null}
          <Menu.Menu position="right">
            <Menu.Item onClick={this.handleSwitchToAddFiles}>
              <Icon name="plus" /> Add Files
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        {!content ? this.renderFiles() : content}
      </div>
    );
  }
}

FilesHierarchy.propTypes = {
  files: PropTypes.arrayOf(shapes.File),
  wip: PropTypes.bool,
  err: shapes.Error,
};

FilesHierarchy.defaultProps = {
  files: EMPTY_ARRAY,
  wip: false,
  err: null,
};

export default FilesHierarchy;
