import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon, Table, Message, Menu, Header } from 'semantic-ui-react';
import filesize from 'filesize';

import { SECURITY_LEVELS } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';

class FilesList extends PureComponent {

  static propTypes = {
    files: PropTypes.arrayOf(shapes.File),
  };

  handleSwitchToAddFiles = () => this.props.setEditMode(true);

  renderItem = (item) => {
    return (
      <Table.Row key={item.id}>
        <Table.Cell collapsing>
          <Link to={`/files/${item.id}`}>
            {item.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {item.uid}
        </Table.Cell>
        <Table.Cell style={item.removed_at ? { textDecoration: 'line-through' } : null}>
          {item.name}
        </Table.Cell>
        <Table.Cell collapsing>
          {filesize(item.size)}
        </Table.Cell>
        <Table.Cell collapsing>
          {moment.utc(item.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          <Icon name="privacy" color={SECURITY_LEVELS[item.secure].color} />
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          {
            item.published ?
              <Icon name="checkmark" color="green" /> :
              <Icon name="ban" color="red" />
          }
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { files, wip, err } = this.props;
    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (files.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading sources" /> :
        <Message>No files for this unit</Message>;
    } else {
      content = (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>UID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Size</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Secure</Table.HeaderCell>
              <Table.HeaderCell>Published</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {files.map(this.renderItem)}
          </Table.Body>
        </Table>);
    }
    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Add Files To Content Unit" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.handleSwitchToAddFiles}>
              <Icon name="plus" /> Add Files
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        {content}
      </div>
    );
  }
}

export default FilesList;
