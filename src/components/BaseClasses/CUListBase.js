import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Icon, Table, Checkbox } from 'semantic-ui-react';

import { CONTENT_TYPE_BY_ID, SECURITY_LEVELS } from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';

class CUListBase extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.ContentUnit),
    select: PropTypes.func,
    selectAll: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.number),
    associatedIds: PropTypes.arrayOf(PropTypes.number),
    withCheckBox: PropTypes.bool,
    hasSelectAll: PropTypes.bool,
    currentLanguage: PropTypes.string.isRequired
  };

  static defaultProps = {
    items: [],
    selectedIds: [],
    associatedIds: [],
    withCheckBox: true,
    hasSelectAll: true
  };

  checkHandler = (cu, checked) => {
    this.props.select(cu.id, checked);
  };

  isAllSelected = () => {
    const { selectedIds, items, associatedIds } = this.props;

    //prevent check
    if (selectedIds.length < (items.length - associatedIds.length)) {
      return false;
    }

    const countAssociatedInPage = items.filter(u => associatedIds.includes(u.id)).length;
    //check that not all associated
    if (countAssociatedInPage === items.length) {
      return false;
    }

    return (countAssociatedInPage + items.filter(u => selectedIds.includes(u.id)).length) === items.length;
  };

  renderItem = (item) => {
    const { selectedIds, currentLanguage, associatedIds, withCheckBox } = this.props;

    const properties = extractI18n(item.i18n, ['name'], currentLanguage)[0];
    return (
      <Table.Row key={item.id} disabled={!item || associatedIds.includes(item.id)}>
        {withCheckBox ? (
          <Table.Cell>
            <Checkbox
              type="checkbox"
              onChange={(event, data) => this.checkHandler(item, data.checked)}
              checked={selectedIds.includes(item.id)}
            />
          </Table.Cell>
        ) : null}
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
        <Table.Cell collapsing>
          {item.properties && item.properties.film_date ? moment.utc(item.properties.film_date).local().format('YYYY-MM-DD HH:mm:ss') : null}
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
    const { items, withCheckBox, selectAll, hasSelectAll } = this.props;
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            {withCheckBox && hasSelectAll ? (
              <Table.HeaderCell width="1">
                <Checkbox
                  type="checkbox"
                  onChange={(event, data) => selectAll(data.checked)}
                  checked={this.isAllSelected()}
                />
              </Table.HeaderCell>
            ) : null}
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>UID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Film Date</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
            <Table.HeaderCell>Secure</Table.HeaderCell>
            <Table.HeaderCell>Published</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default CUListBase;