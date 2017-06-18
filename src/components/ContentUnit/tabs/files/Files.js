import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import filesize from 'filesize';
import { Link } from 'react-router-dom';
import { Button, List, Menu, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import LanguageSelector from '../../../shared/LanguageSelector';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { fileIcon, fileTypes, formatError } from '../../../../helpers/utils';
import { LANG_HEBREW, LANG_UNKNOWN } from '../../../../helpers/consts';

class Files extends Component {

  static propTypes = {
    getFileById: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: undefined,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState = (props) => {
    const { unit = {}, getFileById } = props;
    const files                      = (unit.files || []).map(x => getFileById(x));
    return this.getStateFromFiles(files, LANG_HEBREW);
  };

  componentWillReceiveProps(nextProps) {
    const { unit, getFileById } = nextProps;
    const props                 = this.props;

    // no change ?
    if (unit === props.unit ||
      (unit && props.unit && unit.files === props.unit.files)) {
      return;
    }

    const files = (unit.files || []).map(x => getFileById(x));
    this.setState(this.getStateFromFiles(files, this.state.language || LANG_HEBREW));
  }

  getStateFromFiles = (files, lang) => {
    const total    = files ? files.length : 0;
    const groups   = this.getFilesByLanguage(files);
    const language = groups.has(lang) ? lang : groups.keys().next().value;

    return { total, groups, language };
  };

  getFilesByLanguage = (files) => {
    const groups = new Map();

    (files || []).forEach((file) => {
      const lang = file.language || LANG_UNKNOWN;
      if (!groups.has(lang)) {
        groups.set(lang, []);
      }
      groups.get(lang).push(file);
    });

    return groups;
  };

  handleChangeLanguage = (language) => {
    this.setState({ language });
  };

  handlePlay = (file) => {

  };

  handleDownload = (file) => {
    const url = `http://files.bbdomain.org/get/${file.sha1}/${file.name}`;
    window.open(url, '_blank');
  };

  renderFile(file) {
    const { id, name, size, type, properties } = file;
    const sizeDisplay                          = filesize(size);
    const icon                                 = fileIcon(file);
    const isPhysical                           = size > 0;
    const isAV                                 = ['audio', 'video'].includes(type);

    let durationDisplay = null;
    if (properties && properties.duration) {
      durationDisplay = moment.utc(moment.duration(properties.duration, 's').asMilliseconds()).format('HH:mm:ss');
    }

    return (
      <List.Item key={id}>
        <List.Content floated="right">
          {
            isAV ?
              <Button
                size="mini"
                color="blue"
                icon="play"
                content="Play"
                onClick={() => this.handlePlay(file)}
              /> :
              null
          }
          {
            isPhysical ?
              <Button
                size="mini"
                color="orange"
                icon="download"
                content="Download"
                onClick={() => this.handleDownload(file)}
              /> :
              null
          }
        </List.Content>
        <List.Icon name={icon} size="big" verticalAlign="middle" />
        <List.Content>
          <List.Header>
            <Link to={`/files/${id}`}>{name}</Link>
          </List.Header>
          <List.Description>
            <List horizontal>
              <List.Item><strong>Size:</strong>&nbsp;{sizeDisplay}</List.Item>
              {
                durationDisplay ?
                  <List.Item><strong>Duration:</strong>&nbsp;{durationDisplay}</List.Item> :
                  null
              }
            </List>
          </List.Description>
        </List.Content>
      </List.Item>
    );
  }

  render() {
    const { getWIP, getError } = this.props;
    const wip                  = getWIP('fetchItemFiles');
    const err                  = getError('fetchItemFiles');

    if (err) {
      return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    }

    const { total, groups, language } = this.state;

    if (total === 0) {
      return wip ?
        <LoadingSplash text="Loading files" subtext="We'll be here before you'll know it" /> :
        <Message>No files found for this unit</Message>;
    }

    const files = (groups.get(language) || [])
      .map(f => ({ ...f, ...fileTypes(f) }))
      .sort((a, b) => a.id - b.id);

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item>
            {total} files
          </Menu.Item>
          <Menu.Item>
            <LanguageSelector
              isSelection
              include={Array.from(groups.keys())}
              exclude={[]}
              defaultValue={language}
              onSelect={this.handleChangeLanguage}
            />
          </Menu.Item>
        </Menu>
        <Segment attached>
          <List divided relaxed verticalAlign="middle">
            { files.map(f => this.renderFile(f)) }
          </List>
        </Segment>
      </div>
    );
  }
}

export default Files;
