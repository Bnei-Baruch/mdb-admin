import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Header, Icon, Message, Table } from 'semantic-ui-react';

import {
  CONTENT_TYPE_BY_ID,
  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  EMPTY_ARRAY,
  SECURITY_LEVELS
} from '../../../../helpers/consts';
import { extractI18n, formatError } from '../../../../helpers/utils';
import shouldUpdate from '../../../../hoc/withShouldUpdate';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import EditedField from '../../../shared/Fields/EditedField';

const Cell = shouldUpdate(Table.Cell);

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

  saveCCUName = (id, item, val) => {
    this.props.updateItemUnitProperties(id, item.content_unit_id, { name: val, position: item.position });
  };

  handleSelectionChange    = (unit, data) => {
    const checked = data.checked;
    this.props.onSelectionChange(unit, checked);
  };
  handleSelectionAllChange = ({ checked }) => {
    this.props.onSelectionAllChange(checked);
  };

  isAllSelected = () => {
    const { selectedCCU, units } = this.props;
    return selectedCCU.length >= units.length && units.every(u => selectedCCU.some(cu => cu && u.id === cu.id));
  };

  renderItem = (item) => {
    const { collection, errUpdateCu, errDeleteCu, selectedCCU } = this.props;
    const unit                                                  = item.content_unit;
    const error                                                 = errDeleteCu || errUpdateCu;

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
    const isChecked = selectedCCU.some(ccu => ccu.content_unit_id === unit.id);
    return (
      <Table.Row
        key={unit.id}
        error={error && error.content_units_id === unit.id}
        title={error ? formatError(error) : ''}
      >
        <Cell collapsing propForUpdate={'checked'}>
          <Checkbox
            type="checkbox"
            onChange={(e, data) => this.handleSelectionChange(item, data)}
            checked={isChecked}
          />
        </Cell>
        <Cell collapsing>
          <Link to={`/content_units/${unit.id}`}>
            {unit.id}
          </Link>
        </Cell>
        <Cell collapsing>
          {unit.uid}
        </Cell>
        <Cell>
          {properties}
        </Cell>
        <Cell collapsing>
          {moment.utc(unit.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
        </Cell>
        <Cell collapsing>
          {
            unit.properties && unit.properties.duration ?
              moment.utc(moment.duration(unit.properties.duration, 's').asMilliseconds()).format('HH:mm:ss') :
              '??'
          }
        </Cell>
        <Cell textAlign="center" collapsing>
          <Icon name="privacy" color={SECURITY_LEVELS[unit.secure].color} />
        </Cell>
        <Cell textAlign="center" collapsing>
          {
            unit.published ?
              <Icon name="checkmark" color="green" /> :
              <Icon name="ban" color="red" />
          }
        </Cell>
        <Cell propForUpdate={'value'}>
          <EditedField
            value={item.name}
            onSave={val => this.saveCCUName(collection.id, item, val)}
          />
        </Cell>
      </Table.Row>
    );
  };

  renderSeparator = (type_id) => (<Table.Row key={`type_id_${type_id}`}>
    <Table.Cell colSpan={9} collapsing>
      <Header textAlign="center" block color="blue">
        {CONTENT_TYPE_BY_ID[type_id]}
      </Header>
    </Table.Cell>
  </Table.Row>);

  /**
   *  Render list of units that ordered by type.
   *  On change type of unit in iteration - insert separator with title, new type
   */
  separateByType = list =>
    list.reduce((acc, val, i, arr) => {
      const unit = val.content_unit;
      //if unit type was changed
      if (i === 0 || arr[i - 1].content_unit.type_id !== unit.type_id) {
        acc.push(this.renderSeparator(unit.type_id));
      }
      acc.push(this.renderItem(val));
      return acc;
    }, []);

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
            <Table.HeaderCell>
              <Checkbox
                type="checkbox"
                onChange={(e, data) => this.handleSelectionAllChange(data)}
                checked={this.isAllSelected()}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
            <Table.HeaderCell>Secure</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
            <Table.HeaderCell>Association Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.separateByType(units)}
        </Table.Body>
      </Table>
    );
  }
}

export default Units;
