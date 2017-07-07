import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Header, Icon, Label, Menu, Modal} from 'semantic-ui-react';

import {EMPTY_ARRAY, NS_COLLECTIONS} from '../../helpers/consts';
import {formatError} from '../../helpers/utils';
import * as shapes from '../shapes';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';
import TabsMenu from '../shared/TabsMenu';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';
import CollectionsList from './List';
import NewCollectionForm from './NewCollectionForm';
import DateRange from './filters/DateRange';
import Others from './filters/Others';

const filterTabs = [
    {name: 'Date Range', element: DateRange},
    {name: 'Others', element: Others},
];

class CollectionsMainPage extends Component {

    static propTypes = {
        pageNo: PropTypes.number,
        total: PropTypes.number,
        items: PropTypes.arrayOf(shapes.Collection),
        wip: PropTypes.bool,
        err: shapes.Error,
        onPageChange: PropTypes.func.isRequired,
        onFiltersChange: PropTypes.func.isRequired,
        onFiltersHydrated: PropTypes.func.isRequired,
    };

    static defaultProps = {
        items: EMPTY_ARRAY,
        pageNo: 1,
        total: 0,
        wip: false,
        err: null,
    };

    state = {
        showFilters: false,
        newCollection: true,
    };

    toggleFilters = () => this.setState({showFilters: !this.state.showFilters});

    toggleNewCollection = () => this.setState({newCollection: !this.state.newCollection});

    render() {
        const {showFilters, newCollection} = this.state;

        const {pageNo, total, items, wip, err, onPageChange, onFiltersChange, onFiltersHydrated} = this.props;

        return (
            <div>
                <Menu borderless size="large">
                    <Menu.Item header>
                        <Header content="Collections" size="medium" color="blue"/>
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item onClick={this.toggleFilters}>
                            <Icon name="filter"/>
                            {showFilters ? 'Hide' : 'Show' } Filters
                        </Menu.Item>
                        <Menu.Item onClick={this.toggleNewCollection}>
                            <Icon name="plus"/>
                            New Collection
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>

                <FiltersHydrator namespace={NS_COLLECTIONS} onHydrated={onFiltersHydrated}/>

                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            {
                                showFilters ?
                                    <div>
                                        <TabsMenu items={filterTabs} onFilterApplication={onFiltersChange}/>
                                        <br />
                                    </div> :
                                    null
                            }
                            <FilterTags namespace={NS_COLLECTIONS} onClose={onFiltersChange}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <div style={{textAlign: 'right'}}>
                                {
                                    wip ?
                                        <Label color="yellow" icon={{name: 'spinner', loading: true}}
                                               content="Loading"/> :
                                        null
                                }
                                {
                                    err ?
                                        <Header inverted content={formatError(err)} color="red" icon="warning sign"
                                                floated="left"/> :
                                        null
                                }
                                <ResultsPageHeader pageNo={pageNo} total={total}/>
                                &nbsp;&nbsp;
                                <Pagination pageNo={pageNo} total={total} onChange={onPageChange}/>
                            </div>
                            <CollectionsList items={items}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Modal
                    closeIcon
                    size="small"
                    open={newCollection}
                    onClose={this.toggleNewCollection}>
                    <Modal.Header>Create New Collection</Modal.Header>
                    <Modal.Content>
                        <NewCollectionForm {...this.props} />
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export default CollectionsMainPage;
