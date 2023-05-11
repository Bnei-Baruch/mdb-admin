import React from 'react';
import moment from 'moment';
import { filesize } from 'filesize';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Header, Icon, List, Menu, Segment, Flag, Dropdown } from 'semantic-ui-react';

import { selectors, actions } from '../../../../redux/modules/files';
import { LANGUAGES, SECURITY_LEVELS, ALL_FILE_TYPES, MEDIA_TYPES } from '../../../../helpers/consts';
import { fileIcon } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import LanguageSelector from '../../../shared/LanguageSelector';

const typeOptions = ALL_FILE_TYPES.map(t => ({ text: t, value: t }));

const byTypeMimeTypeOptions = Object.values(MEDIA_TYPES).reduce((acc, { mime_type, type }) => {
  if (!mime_type || !type) return acc;
  const byT = acc[type] || [];
  if (!byT.find(x => x.value === mime_type)) {
    byT.push({ text: mime_type, value: mime_type });
  }
  acc[type] = byT;
  return acc;
}, {});

const Details = (props) => {
  const { file } = props;
  const errLang  = useSelector(state => selectors.getError(state.files, 'updateProperties'));

  const dispatch             = useDispatch();
  const handleChangeLanguage = (e, { value }) => {
    dispatch(actions.updateProperties(file.id, { language: value, content_unit_id: file.content_unit_id }));
  };

  const handleChangeType = (e, { value }) => {
    dispatch(actions.updateProperties(file.id, { type: value, content_unit_id: file.content_unit_id }));
  };

  const handleChangeMimeType = (e, { value }) => {
    dispatch(actions.updateProperties(file.id, { mime_type: value, content_unit_id: file.content_unit_id }));
  };

  if (!file) {
    return null;
  }

  const language = LANGUAGES[file.language] || { text: 'none' };
  const icon     = fileIcon(file);

  return (
    <div>
      <Menu attached borderless size="large">
        <Menu.Item header>
          <Header icon={icon} content={file.name} size="tiny" color="blue" />
        </Menu.Item>
      </Menu>

      <Segment attached>
        <List divided relaxed>
          <List.Item>
            <List.Content floated="right">
              {file.id}
            </List.Content>
            <List.Header>ID</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {file.uid}
            </List.Content>
            <List.Header>UID</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {filesize(file.size)}
            </List.Content>
            <List.Header>Size</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {file.sha1}
            </List.Content>
            <List.Header>SHA-1</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {moment.utc(file.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </List.Content>
            <List.Header>DB created_at</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {
                file.file_created_at
                  ? moment.utc(file.file_created_at).format('YYYY-MM-DD HH:mm:ss')
                  : null
              }
            </List.Content>
            <List.Header>OS created_at</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              <Dropdown
                options={typeOptions}
                value={file.type || 'none'}
                onChange={handleChangeType}
                selectOnBlur={false}
              />
            </List.Content>
            <List.Header>Type</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {file.sub_type}
            </List.Content>
            <List.Header>Sub Type</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              <Dropdown
                options={byTypeMimeTypeOptions[file.type]}
                value={file.mime_type || 'none'}
                onChange={handleChangeMimeType}
                selectOnBlur={false}
              />
            </List.Content>
            <List.Header>Mime Type</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              <LanguageSelector
                item
                scrolling
                value={language.value || 'none'}
                text={
                  (
                    <>
                      {language.flag ? <Flag name={language.flag} /> : null}
                      {language.text}
                    </>
                  )
                }
                onChange={handleChangeLanguage}
                error={errLang}
              />
            </List.Content>
            <List.Header>Language</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {
                file.content_unit_id
                  ? (
                    <Link to={`/content_units/${file.content_unit_id}`}>
                      {file.content_unit_id}
                    </Link>
                  )
                  : 'none'
              }
            </List.Content>
            <List.Header>Content Unit</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {
                file.parent_id
                  ? (
                    <Link to={`/files/${file.parent_id}`}>
                      {file.parent_id}
                    </Link>
                  )
                  : 'none'
              }
            </List.Content>
            <List.Header>Parent</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              <Header
                size="tiny"
                content={SECURITY_LEVELS[file.secure].text}
                color={SECURITY_LEVELS[file.secure].color}
              />
            </List.Content>
            <List.Header>Secure</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {
                file.published
                  ? <Icon name="checkmark" color="green" />
                  : <Icon name="ban" color="red" />
              }
            </List.Content>
            <List.Header>Published</List.Header>
          </List.Item>
          <List.Item>
            <List.Content floated="right">
              {
                file.removed_at
                  ? moment.utc(file.removed_at).format('YYYY-MM-DD HH:mm:ss')
                  : null
              }
            </List.Content>
            <List.Header>Removed</List.Header>
          </List.Item>
        </List>
      </Segment>
    </div>
  );
};

Details.propTypes = {
  file: shapes.File,
};

Details.defaultProps = {
  file: null,
};

export default Details;
