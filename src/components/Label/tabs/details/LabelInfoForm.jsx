import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Header, List, Menu, Segment } from 'semantic-ui-react';

import { EMPTY_OBJECT } from '../../../../helpers/consts';

class LabelInfoForm extends Component {
  render() {
    const { label } = this.props;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Label Info" size="medium" color="blue" />
          </Menu.Item>
        </Menu>

        <Segment attached>
          <List divided relaxed>
            <List.Item>
              <List.Content floated="right">{label.id}</List.Content>
              <List.Header>ID:</List.Header>
            </List.Item>
            <List.Item>
              <List.Content floated="right">{label.uid}</List.Content>
              <List.Header>UID:</List.Header>
            </List.Item>
            <List.Item>
              <List.Content floated="right">{label.content_unit_id}</List.Content>
              <List.Header>Content Unit UID: </List.Header>
            </List.Item>
            <List.Item>
              <List.Content floated="right">
                {
                  moment.utc(label.created_at).format('YYYY-MM-DD HH:mm:ss')
                }
              </List.Content>
              <List.Header>Created At: </List.Header>
            </List.Item>
            <List.Item>
              <List.Content floated="right">{label.media_type}</List.Content>
              <List.Header>Media Type: </List.Header>
            </List.Item>
          </List>
        </Segment>
      </div>
    );
  }
}

LabelInfoForm.propTypes = {
  label: PropTypes.object,
};

LabelInfoForm.defaultProps = {
  label: EMPTY_OBJECT,
};

export default LabelInfoForm;
