import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon, Table, Checkbox, Message } from 'semantic-ui-react';

import {
  CONTENT_TYPE_BY_ID,
  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  SECURITY_LEVELS
} from '../../../../helpers/consts';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import { extractI18n, formatError, titleize } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import EditedField from '../../../shared/Fields/EditedField';

class NewAssociations extends PureComponent {

  static propTypes = {
    units: PropTypes.arrayOf(shapes.CollectionContentUnit),
    updateItemUnitProperties: PropTypes.func,
    collection: shapes.Collection,
    wip: PropTypes.bool,
    err: shapes.Error,
    errDeleteCu: shapes.Error,
    errUpdateCu: shapes.Error,
    selectCUIndex: PropTypes.func,
    deleteItemUnit: PropTypes.func,
    selectedCU: PropTypes.arrayOf(PropTypes.object),
  };

  itemsMustUpdate = [];

  componentWillUpdate() {
    const { selectCUIndex } = this.props;
    if (this.itemsMustUpdate.length === 0) {
      return;
    }
    this.itemsMustUpdate.forEach(cu => {
      selectCUIndex(cu.index, cu, false);
      selectCUIndex(cu.index, cu, true);
    });
    this.itemsMustUpdate.splice(0);
  }

  saveAssociationNum = (id, cuId, val) => {
    this.props.updateItemUnitProperties(id, cuId, { name: val });
  };

  checkHandler = (index, unit, checked) => {
    this.props.selectCUIndex(index, unit, checked);
    this.setState({ checked: checked });
  };

  updateIndexForSelected = (item, index) => {

    if (!item.index || item.index === index) {
      return;
    }
    this.itemsMustUpdate.push({ ...item, index });
  };

  renderItem = (item, index) => {
    const { collection, errUpdateCu, errDeleteCu } = this.props;
    const unit                                     = item.content_unit;
    let properties                                 = extractI18n(unit.i18n, ['name'])[0];
    this.updateIndexForSelected(item, index);
    let error = errDeleteCu ? errDeleteCu : errUpdateCu;

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
      <Table.Row key={unit.id} error={error && error.content_units_id === unit.id} title={error ? formatError(error) : ''}>
        <Table.Cell>
          <Checkbox
            type="checkbox"
            onChange={(event, data) => this.checkHandler(index, item, data.checked)}
            checked={this.props.selectedCU.find((cu) => {
              cu.content_unit_id === unit.id;
            })}></Checkbox>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/content_units/${unit.id}`}>
            {item.position}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {unit.uid}
        </Table.Cell>
        <Table.Cell>
          {CONTENT_TYPE_BY_ID[unit.type_id]}
        </Table.Cell>
        <Table.Cell>
          {properties}
        </Table.Cell>
        <Table.Cell>
          {moment.utc(unit.created_at).local().format('YYYY-MM-DD HH:mm:ss')}
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
        <Table.Cell>
          <EditedField
            value={item.name}
            onSave={(val) => this.saveAssociationNum(collection.id, unit.id, val)} />
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { units, wip, err } = this.props;
    let content               = '';
    let header                = '';

    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (units.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading content units" /> :
        <Message>No content units found for this collection</Message>;
    } else {
      content = (<Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Properties</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Secure</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
            <Table.HeaderCell>Association No.</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            units.map((x, i) => this.renderItem(x, i))
          }
        </Table.Body>
      </Table>);
    }
    return (<div>{header + content}</div>);
  }
}

export default NewAssociations;