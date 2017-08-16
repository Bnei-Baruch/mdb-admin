import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EMPTY_ARRAY, EMPTY_OBJECT, NS_UNITS, NS_COLLECTIONS }  from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import { selectors } from '../../../../redux/modules/collections';
import { actions as actions} from '../../../../redux/modules/lists';
import { selectors as units } from '../../../../redux/modules/content_units';

import AssociationsMainPage from './MainPage';

class AssociationsTab extends Component {

    static propTypes = {
        location: shapes.HistoryLocation.isRequired,
        fetchList: PropTypes.func.isRequired,
        setPage: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { collection } = this.props;
        if (collection) {
            this.askForData(collection.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.collection && !this.props.collection && nextProps.collection.id !== this.props.collection.id) {
            this.askForData(nextProps.collection.id);
        }
    }

    getPageNo = (search) => {
        let page = 0;
        if (search) {
            const match = search.match(/page=(\d+)/);
            if (match) {
                page = parseInt(match[1], 10);
            }
        }

        return (isNaN(page) || page <= 0) ? 1 : page;
    };

    handlePageChange = (pageNo) => {
        const { setPage } = this.props;
        setPage(NS_UNITS, pageNo);
        this.askForData(pageNo);
    };

    handleFiltersChange = () => this.handlePageChange(1);

    handleFiltersHydrated = () => {
       /* const { location }       = this.props;
        const pageNoFromLocation = this.getPageNo(location.search);
        this.handlePageChange(pageNoFromLocation);*/
    };

    askForData = (pageNo) => {
        this.props.fetchList(NS_UNITS, pageNo, NS_COLLECTIONS);
    };


    render() {
        const { location, fetchList, setPage, ...rest } = this.props;

        return (
            <AssociationsMainPage
                {...rest}
                onPageChange={this.handlePageChange}
                onFiltersChange={this.handleFiltersChange}
                onFiltersHydrated={this.handleFiltersHydrated}
                />
        );
    }
}

const mapState = (state, ownProps) => {
    const { collection = EMPTY_OBJECT } = ownProps;
    const unitIDs = collection.content_units;
    const denormCCUs = units.denormCCUs(state.content_units);
    return {
        units: unitIDs ? denormCCUs(unitIDs) : EMPTY_ARRAY,
        wip: selectors.getWIP(state.collections, 'fetchItemUnits'),
        err: selectors.getError(state.collections, 'fetchItemUnits'),
    };
};

function mapDispatch(dispatch) {
    return bindActionCreators(
        {
            fetchList: actions.fetchList,
            setPage: actions.setPage,
        }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsTab);
