import React from 'react';
import moment from 'moment';
import filesize from 'filesize';
import { Link } from 'react-router-dom';
import { Flag, Header, Icon, List, Menu, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { fileIcon } from '../../../../helpers/utils';
import { LANGUAGES, SECURITY_LEVELS } from '../../../../helpers/consts';

const Details = (props) => {
  const { file } = props;
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
            <strong>ID</strong>
            <List.Content floated="right">
              {file.id}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>UID</strong>
            <List.Content floated="right">
              {file.uid}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Size</strong>
            <List.Content floated="right">
              {filesize(file.size)}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>SHA-1</strong>
            <List.Content floated="right">
              {file.sha1}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>DB created_at</strong>
            <List.Content floated="right">
              {moment.utc(file.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>OS created_at</strong>
            <List.Content floated="right">
              {
                file.file_created_at ?
                  moment.utc(file.file_created_at).format('YYYY-MM-DD HH:mm:ss') :
                  null
              }
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Type</strong>
            <List.Content floated="right">
              {file.type}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Sub Type</strong>
            <List.Content floated="right">
              {file.sub_type}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Mime Type</strong>
            <List.Content floated="right">
              {file.mime_type}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Language</strong>
            <List.Content floated="right">
              {language.flag ? <Flag name={language.flag} /> : null }
              {language.text}
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Content Unit</strong>
            <List.Content floated="right">
              {
                file.content_unit_id ?
                  <Link to={`/content_units/${file.content_unit_id}`}>
                    {file.content_unit_id}
                  </Link> :
                  'none'
              }
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Parent</strong>
            <List.Content floated="right">
              {
                file.parent_id ?
                  <Link to={`/files/${file.parent_id}`}>
                    {file.parent_id}
                  </Link> :
                  'none'
              }
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Secure</strong>
            <List.Content floated="right">
              <Header
                size="tiny"
                content={SECURITY_LEVELS[file.secure].text}
                color={SECURITY_LEVELS[file.secure].color}
              />
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Published</strong>
            <List.Content floated="right">
              {
                file.published ?
                  <Icon name="checkmark" color="green" /> :
                  <Icon name="ban" color="red" />
              }
            </List.Content>
          </List.Item>
          <List.Item>
            <strong>Removed</strong>
            <List.Content floated="right">
              {
                file.removed_at ?
                  moment.utc(file.removed_at).format('YYYY-MM-DD HH:mm:ss') :
                  null
              }
            </List.Content>
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
