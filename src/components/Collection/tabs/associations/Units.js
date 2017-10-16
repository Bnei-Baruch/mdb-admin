import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Icon, Message, Table } from 'semantic-ui-react';

import {
  CONTENT_TYPE_BY_ID,
  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  EMPTY_ARRAY,
  SECURITY_LEVELS
} from '../../../../helpers/consts';
import { extractI18n, formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import EditedField from '../../../shared/Fields/EditedField';

class Units extends PureComponent {

  static propTypes = {
    collection: shapes.Collection,
    units: PropTypes.arrayOf(shapes.CollectionContentUnit),
    selectedCCU: PropTypes.arrayOf(PropTypes.object),
    updateItemUnitProperties: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    wip: PropTypes.bool,
    err: shapes.Error,
    errDeleteCu: shapes.Error,
    errUpdateCu: shapes.Error,
  };

  static defaultProps = {
    collection: null,
    units: EMPTY_ARRAY,
    selectedCCU: EMPTY_ARRAY,
    wip: false,
    err: null,
    errDeleteCu: null,
    errUpdateCu: null,
  };

  state = {
    checked: false
  };

  saveCCUName = (id, item, val) => {
    this.props.updateItemUnitProperties(id, item.content_unit_id, { name: val, position: item.position });
  };

  handleSelectionChange = (unit, data) => {
    const checked = data.checked;
    this.props.onSelectionChange(unit, checked);
    this.setState({ checked });
  };

  renderItem = (item) => {
    const { collection, errUpdateCu, errDeleteCu, selectedCCU } = this.props;
    const unit                                                 = item.content_unit;
    const error                                                = errDeleteCu || errUpdateCu;

    let properties = extractI18n(unit.i18n, ['name'])[0];
    if (!properties) {
      switch (CONTENT_TYPE_BY_ID[unit.type_id]) {
      case CT_SPECIAL_LESSON:
      case CT_DAILY_LESSON: {
        const { film_date: filmDate, number } = unit.properties;
        properties                            = filmDate;
        if (number) {
          properties += `, number ${number}`;
        }
        break;
      }
      default:
        properties = unit.properties ? unit.properties.film_date : '';
      }
    }

    return (
      <Table.Row
        key={unit.id}
        error={error && error.content_units_id === unit.id}
        title={error ? formatError(error) : ''}
      >
        <Table.Cell collapsing>
          <Checkbox
            type="checkbox"
            onChange={(e, data) => this.handleSelectionChange(item, data)}
            checked={selectedCCU.findIndex(cu => cu.content_unit_id === unit.id) !== -1}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Link to={`/content_units/${unit.id}`}>
            {unit.id}
          </Link>
        </Table.Cell>
        <Table.Cell collapsing>
          {unit.uid}
        </Table.Cell>
        <Table.Cell>
          {properties}
        </Table.Cell>
        <Table.Cell collapsing>
          {CONTENT_TYPE_BY_ID[unit.type_id]}
        </Table.Cell>
        <Table.Cell collapsing>
          {moment.utc(unit.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
        </Table.Cell>
        <Table.Cell collapsing>
          {moment.utc(moment.duration(unit.properties.duration, 's').asMilliseconds()).format('HH:mm:ss')}
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          <Icon name="privacy" color={SECURITY_LEVELS[unit.secure].color} />
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {
            unit.published ?
              <Icon name="checkmark" color="green" /> :
              <Icon name="ban" color="red" />
          }
        </Table.Cell>
        <Table.Cell>
          <EditedField
            value={item.name}
            onSave={val => this.saveCCUName(collection.id, item, val)}
          />
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { units, wip, err } = this.props;

    if (err) {
      return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    }

    if (units.length === 0) {
      return wip ?
        <LoadingSplash text="Loading content units" /> :
        <Message>No content units found for this collection</Message>;
    }

    return (
      <Table celled selectable compact size="small">
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
            <Table.HeaderCell>Association No.</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {units.map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default Units;
