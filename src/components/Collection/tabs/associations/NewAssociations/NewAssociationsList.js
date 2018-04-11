import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Icon, Table } from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID, EMPTY_ARRAY, SECURITY_LEVELS } from '../../../../../helpers/consts';
import { extractI18n } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';

class FilesList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.ContentUnit),
    selectedCCU: PropTypes.arrayOf(PropTypes.object),
    selectCCU: PropTypes.func,
    associatedCUIds: PropTypes.object,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  checkHandler = (unit, checked) => {
    this.props.selectCCU(unit, checked);
    this.setState({ checked });
  };

  isAllSelected = () => {
    const { selectedCCU, units, associatedCUIds } = this.props;
    return selectedCCU.length >= (units.length - associatedCUIds.length) &&
      units.every(u => associatedCUIds.includes(u.id) || selectedCCU.some(su => su.id === u.id));
  };

  renderItem = (unit) => {
    const properties = extractI18n(unit.i18n, ['name'])[0];
    const isChecked  = this.props.selectedCCU.some(ccu => {
      return ccu.id === unit.id;
    });

    return (
      <Table.Row key={unit.id} disabled={this.props.associatedCUIds.has(unit.id)}>
        <Table.Cell>
          <Checkbox
            type="checkbox"
            onChange={(event, data) => this.checkHandler(unit, data.checked)}
            checked={isChecked}
          />
        </Table.Cell>
        <Table.Cell>
          <Link to={`/content_units/${unit.id}`}>
            {unit.id}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {unit.uid}
        </Table.Cell>
        <Table.Cell>
          {properties}
        </Table.Cell>
        <Table.Cell>
          {CONTENT_TYPE_BY_ID[unit.type_id]}
        </Table.Cell>
        <Table.Cell>
          {moment.utc(unit.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
        </Table.Cell>
        <Table.Cell>
          {
            unit.properties && unit.properties.duration ?
              moment.utc(moment.duration(unit.properties.duration, 's').asMilliseconds()).format('HH:mm:ss') :
              '??'
          }
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Icon name="privacy" color={SECURITY_LEVELS[unit.secure].color} />
        </Table.Cell>
        <Table.Cell textAlign="center">
          {
            unit.published ?
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
            <Table.HeaderCell>
              <Checkbox
                type="checkbox"
                onChange={(event, data) => this.props.selectAllCUs(data.checked)}
                checked={this.isAllSelected()}
              />
            </Table.HeaderCell>
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
          {this.props.items.map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default FilesList;
