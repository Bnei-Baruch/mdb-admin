import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Grid, Header, Icon, Label, Menu, Button, Modal } from 'semantic-ui-react';
import uniq from 'lodash/uniq';

import { formatError } from '../../../../../helpers/utils';

import {
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  NS_UNIT_ASSOCIATION_COLLECTION,
  COLLECTION_TYPES
} from '../../../../../helpers/consts';
import { actions, selectors } from '../../../../../redux/modules/lists';
import { selectors as collections } from '../../../../../redux/modules/collections';
import { selectors as tagSelectors } from '../../../../../redux/modules/tags';

import ResultsPageHeader from '../../../../shared/ResultsPageHeader';
import TabsMenu from '../../../../shared/TabsMenu';
import Pagination from '../../../../shared/Pagination';

import * as shapes from '../../../../shapes';
import CollectionsList from './List';
import FiltersHydrator from '../../../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../../../Filters/FilterTags/FilterTags';
import DateRange from '../../../../Filters/DateRange';
import Others from '../../../../Filters/Others';
import FreeText from '../../../../Filters/FreeText';

const filterTabs = [
  { name: 'Free Text', element: FreeText, namespace: NS_UNIT_ASSOCIATION_COLLECTION },
  { name: 'Date Range', element: DateRange, namespace: NS_UNIT_ASSOCIATION_COLLECTION },
  { name: 'Others', element: Others, namespace: NS_UNIT_ASSOCIATION_COLLECTION, contentTypes: COLLECTION_TYPES },
];

class NewCollections extends PureComponent {

  static propTypes = {
    unit: shapes.ContentUnit,
    items: PropTypes.arrayOf(shapes.Collection),
    getTagByUID: PropTypes.func.isRequired,
    associatedCIds: PropTypes.arrayOf(PropTypes.number),
    pageNo: PropTypes.number,
    total: PropTypes.number,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
  };

  state = {
    showFilters: false,
    selectedCIds: []
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
    setPage(NS_UNIT_ASSOCIATION_COLLECTION, pageNo);
    this.askForData(pageNo);
  };

  handleFiltersCancel = () => this.toggleFilters();

  handleFiltersChange = (isToggle = true) => {
    if (isToggle) {
      this.toggleFilters();
    }
    this.toggleFilters();
  };

  onFiltersHydrated = () => this.onPageChange(1);

  askForData = (pageNo) => this.props.fetchList(NS_UNIT_ASSOCIATION_COLLECTION, pageNo);

  toggleFilters = () => this.setState({ showFilters: !this.state.showFilters });

  handleAssociate = () => {
    const { associate, unit } = this.props;
    this.state.selectedCIds.forEach(cId => associate(cId, [{
      content_unit_id: unit.id,
      name: '',
      position: 0
    }]));
  };

  handleClose = () => {
    this.setState({ selectedCIds: [], showFilters: false });
    this.props.handleShowAssociateModal();
  };

  selectCollection = (id, checked) => {
    const selectedCIds = this.state.selectedCIds;
    if (checked) {
      selectedCIds.push(id);
    } else {
      selectedCIds.splice(selectedCIds.findIndex(x => id === x), 1);
    }
    this.setState({ selectedCIds: [...selectedCIds] });
  };

  selectAllCollections = (checked) => {
    const { items, associatedCIds } = this.props;
    const { selectedCIds }          = this.state;
    if (checked) {
      this.setState({ selectedCIds: uniq([...selectedCIds, ...items.filter(c => !associatedCIds.includes(c.id)).map(x => x.id)]) });
    } else {
      this.setState({ selectedCIds: selectedCIds.filter(id => !items.some(y => id === y.id)) });
    }
  };

  render() {

    const { showFilters, selectedCIds } = this.state;
    const {
            pageNo,
            total,
            items,
            wip,
            err,
            wipAssociate,
            errAssociate,
            getTagByUID,
            associatedCIds,
            isShowAssociateModal,
            currentLanguage,
          }                             = this.props;
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

          <FiltersHydrator namespace={NS_UNIT_ASSOCIATION_COLLECTION} onHydrated={this.onFiltersHydrated} />

          <Grid>
            <Grid.Row>
              <Grid.Column>
                {
                  showFilters ?
                    <div>
                      <TabsMenu items={filterTabs} onFilterApplication={this.handleFiltersChange} onFilterCancel={this.handleFiltersCancel} />
                      <br />
                    </div> :
                    null
                }
                <FilterTags namespace={NS_UNIT_ASSOCIATION_COLLECTION} onClose={this.handleFiltersChange} />
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
                  getTagByUID={getTagByUID}
                  selectedCIds={selectedCIds}
                  associatedCIds={associatedCIds}
                  selectCollection={this.selectCollection}
                  selectAllCollections={this.selectAllCollections}
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
  const status    = selectors.getNamespaceState(state.lists, NS_UNIT_ASSOCIATION_COLLECTION) || EMPTY_OBJECT;
  const denormIDs = collections.denormIDs(state.collections);
  return {
    ...status,
    wip: collections.getWIP(state.collections, 'fetchList'),
    err: collections.getError(state.collections, 'fetchList'),
    items: Array.isArray(status.items) && status.items.length > 0 ?
      denormIDs(status.items) :
      EMPTY_ARRAY,
    getTagByUID: tagSelectors.getTagByUID(state.tags),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(NewCollections);
