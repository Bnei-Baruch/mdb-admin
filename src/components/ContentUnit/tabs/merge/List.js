import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Icon, Table } from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY, SECURITY_LEVELS } from '../../../../helpers/consts';
import { extractI18n } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';

class ContentUnitList extends PureComponent {

  static propTypes = {
    unit: shapes.ContentUnit,
    units: PropTypes.arrayOf(shapes.ContentUnit),
    selectedCUIds: PropTypes.arrayOf(PropTypes.number),
    selectCU: PropTypes.func,
    associatedCUIds: PropTypes.object,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    units: EMPTY_ARRAY,
  };

  checkHandler = (cu, checked) => {
    this.props.selectCU(cu.id, checked);
  };

  renderItem = (item) => {
    if (!item || this.props.unit.id === item.id) {
      return null;
    }
    const { selectedCUIds, currentLanguage } = this.props;

    const properties = extractI18n(item.i18n, ['name'], currentLanguage)[0];
    return (
      <Table.Row key={item.id}>
        <Table.Cell>
          <Checkbox
            type="checkbox"
            onChange={(event, data) => this.checkHandler(item, data.checked)}
            checked={selectedCUIds.includes(item.id)}
          />
        </Table.Cell>
        <Table.Cell>
          <Link to={`/content_units/${item.id}`}>
            {item.id}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {item.uid}
        </Table.Cell>
        <Table.Cell>
          {properties}
        </Table.Cell>
        <Table.Cell>
          {CONTENT_TYPE_BY_ID[item.type_id]}
        </Table.Cell>
        <Table.Cell>
          {moment.utc(item.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
        </Table.Cell>
        <Table.Cell>
          {
            item.properties && item.properties.duration ?
              moment.utc(moment.duration(item.properties.duration, 's').asMilliseconds()).format('HH:mm:ss') :
              '??'
          }
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Icon name="privacy" color={SECURITY_LEVELS[item.secure].color} />
        </Table.Cell>
        <Table.Cell textAlign="center">
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
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
            <Table.HeaderCell>Secure</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.props.units.map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default ContentUnitList;
