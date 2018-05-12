import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Grid, Header, Icon, Label, Menu, Button, Modal } from 'semantic-ui-react';
import uniq from 'lodash/uniq';

import { formatError } from '../../../../../helpers/utils';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNIT_ASSOCIATION_CU } from '../../../../../helpers/consts';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { selectors as units } from '../../../../../redux/modules/collections';

import ResultsPageHeader from '../../../../shared/ResultsPageHeader';
import FiltersHydrator from '../../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../../Filters/FilterTags/FilterTags';
import TabsMenu from '../../../../shared/TabsMenu';
import Pagination from '../../../../shared/Pagination';

import * as shapes from '../../../../shapes';
import CollectionsList from './List';
import DateRange from './filters/DateRange';
import Others from './filters/Others';
import FreeText from './filters/FreeText';

const filterTabs = [
  { name: 'Free Text', element: FreeText },
  { name: 'Date Range', element: DateRange },
  { name: 'Others', element: Others },
];

class NewUnits extends PureComponent {

  static propTypes = {
    unit: shapes.ContentUnit,
    items: PropTypes.arrayOf(shapes.ContentUnit),
    associatedIds: PropTypes.arrayOf(PropTypes.number),
    pageNo: PropTypes.number,
    total: PropTypes.number,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
    associatedIds: []
  };

  state = {
    showFilters: false,
    selectedIds: []
  };

  componentDidMount() {
    this.askForData(1);
  }

  componentWillReceiveProps(nextProps) {
    const { wipAssociate } = this.props;
    if (nextProps.unit && wipAssociate && !nextProps.wipAssociate) {
      this.askForData(1);
      this.handleClose();
    }
  }

  onPageChange = (pageNo) => {
    const { setPage } = this.props;
    setPage(NS_UNIT_ASSOCIATION_CU, pageNo);
    this.askForData(pageNo);
  };

  onFiltersChange = () => this.onPageChange(1);

  onFiltersHydrated = () => this.onPageChange(1);

  askForData = (pageNo) => this.props.fetchList(NS_UNIT_ASSOCIATION_CU, pageNo);

  toggleFilters = () => this.setState({ showFilters: !this.state.showFilters });

  handleAssociate = () => {
    const { associate, unit } = this.props;
    this.state.selectedIds.forEach(cId => associate(unit.id, cId));
    this.handleClose();

  };

  handleClose = () => {
    this.setState({ selectedIds: [], showFilters: false });
    this.props.handleToggleModal();
  };

  selectCU = (id, checked) => {
    const selectedIds = this.state.selectedIds;
    if (checked) {
      selectedIds.push(id);
    } else {
      selectedIds.splice(selectedIds.findIndex(x => id === x), 1);
    }
    this.setState({ selectedIds: [...selectedIds] });
  };

  selectAllCUs = (checked) => {
    const { items, associatedIds } = this.props;
    const { selectedIds }           = this.state;
    if (checked) {
      this.setState({ selectedIds: uniq([...selectedIds, ...items.filter(c => !associatedIds.includes(c.id)).map(x => x.id)]) });
    } else {
      this.setState({ selectedIds: selectedIds.filter(id => !items.some(y => id === y.id)) });
    }
  };

  render() {

    const { showFilters, selectedIds } = this.state;
    const {
            pageNo,
            total,
            items,
            wip,
            err,
            wipAssociate,
            errAssociate,
            associatedIds,
            isShowAssociateModal,
            currentLanguage,
          }                            = this.props;
    if (!isShowAssociateModal) {
      return null;
    }
    return (
      <Modal
        closeIcon
        size="fullscreen"
        open={isShowAssociateModal}
        onClose={this.handleClose}>
        <Modal.Header content="Associate Collections" />
        <Modal.Content scrolling>
          <Menu borderless size="large">
            <Menu.Item onClick={this.toggleFilters}>
              <Icon name="filter" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>

                <ResultsPageHeader pageNo={pageNo} total={total} />
                &nbsp;&nbsp;
                <Pagination pageNo={pageNo} total={total} onChange={this.onPageChange} />
              </Menu.Item>
            </Menu.Menu>
          </Menu>

          <FiltersHydrator namespace={NS_UNIT_ASSOCIATION_CU} onHydrated={this.onFiltersHydrated} />

          <Grid>
            <Grid.Row>
              <Grid.Column>
                {
                  showFilters ?
                    <div>
                      <TabsMenu items={filterTabs} onFilterApplication={this.onFiltersChange} />
                      <br />
                    </div> :
                    null
                }
                <FilterTags namespace={NS_UNIT_ASSOCIATION_CU} onClose={this.onFiltersChange} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div style={{ textAlign: 'right' }}>
                  {
                    wip || wipAssociate ?
                      <Label
                        color="yellow"
                        icon={{ name: 'spinner', loading: true }}
                        content="Loading"
                      /> :
                      null
                  }
                  {
                    err || errAssociate ?
                      <Header
                        inverted
                        content={formatError(err || errAssociate)}
                        color="red"
                        icon="warning sign"
                        floated="left"
                      /> :
                      null
                  }
                </div>
                <CollectionsList
                  items={items}
                  selectedIds={selectedIds}
                  associatedIds={associatedIds}
                  selectCU={this.selectCU}
                  selectAllCUs={this.selectAllCUs}
                  currentLanguage={currentLanguage} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Cancel"
                  onClick={this.handleClose} />
          <Button
              onClick={this.handleAssociate}
            content="Associate content unit to collections"
            color="blue" />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapState = (state) => {
  const status    = selectors.getNamespaceState(state.lists, NS_UNIT_ASSOCIATION_CU) || EMPTY_OBJECT;
  const denormIDs = units.denormIDs(state.content_units);
  return {
    ...status,
    wip: units.getWIP(state.content_units, 'fetchList'),
    err: units.getError(state.content_units, 'fetchList'),
    items: Array.isArray(status.items) && status.items.length > 0 ? denormIDs(status.items) : EMPTY_ARRAY,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(NewUnits);
