import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Icon, Table, Menu, Header } from 'semantic-ui-react';
import filesize from 'filesize';

import { SECURITY_LEVELS } from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';

class FilesList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.File),
    currentFiles: PropTypes.arrayOf(shapes.File),
    handleSelectFile: PropTypes.func,
    handleSelectAllFiles: PropTypes.func,
    selectedFilesIds: PropTypes.arrayOf(PropTypes.number),
  };

  checkHandler = (cu, checked) => {
    this.props.handleSelectFile(cu);
    this.setState({ checked });
  };

  selectAllFiles = (event, data) => {
    this.props.handleSelectAllFiles(data.checked);
  };

  isAllSelected = () => {
    const { selectedFilesIds, items, currentFiles } = this.props;

    //prevent check
    if (selectedFilesIds.length < (items.length - currentFiles.length)) {
      return false;
    }

    const countAssociatedInPage = items.filter(f => currentFiles.some(cf => cf.id === f.id)).length;
    //check that not all associated
    if (countAssociatedInPage === items.length) {
      return false;
    }

    return (countAssociatedInPage + items.filter(f => selectedFilesIds.includes(f.id)).length) === items.length;
  };

  renderItem = (item) => {
    const { selectedFilesIds, currentFiles } = this.props;

    return (
      <Table.Row key={item.id} disabled={currentFiles.some(f => f.id === item.id)}>
        <Table.Cell>
          <Checkbox
            type="checkbox"
            onChange={(event, data) => this.checkHandler(item, data.checked)}
            checked={selectedFilesIds.includes(item.id)}
          />
        </Table.Cell>
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
    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Add Files To Content Unit" size="medium" color="blue" />
          </Menu.Item>
        </Menu>
        <div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Checkbox
                    type="checkbox"
                    onChange={this.selectAllFiles}
                    checked={this.isAllSelected()}
                  />
                </Table.HeaderCell>
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
              {this.props.items.map(this.renderItem)}
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

export default FilesList;
