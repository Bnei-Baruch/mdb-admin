import React, { Component } from "react";
import PropTypes from "prop-types";
import { Segment } from "semantic-ui-react";
import { AutoSizer, InfiniteLoader, Table } from "react-virtualized";
import { filterConfigShape } from '../shapes';
import Filters from '../Filters/Filters';
import SearchHeader from "../SearchHeader/SearchHeader";
import "./InfiniteSearch.css";

import "react-virtualized/styles.css";

const placeholderElement = <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    }}>
        <div className="placeholder"/>
    </div>
;

const RowRenderer = ({className, columns, key, style, index, rowData}) => {
    return (
        <div className={className}
             key={key}
             style={style}>
            { (rowData && typeof rowData.id !== 'undefined') ? columns : placeholderElement }
        </div>
    );
};

const MIN_STOP_INDEX = 100;

export default class InfiniteSearch extends Component {
    static propTypes = {
        namespace: PropTypes.string.isRequired,
        search: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
        columns: PropTypes.arrayOf(PropTypes.element).isRequired,
        filters: PropTypes.arrayOf(filterConfigShape),
        searchError: PropTypes.any,
    };

    static defaultProps = {
        filters: [],
        searchError: undefined
    };

    state = {
        items: [],
    };

    // Should be removed after Search is.
    clearItems = () => {
        this.resetInfiniteLoaderCache();
        this.setState({items: []});
    };

    handleFilterChange = (name, value) => {
        // Start index starts from 1 in the backend.
        this.props.search({[name]: value}, {'start_index': 1, 'stop_index': MIN_STOP_INDEX}).then(data => {
            this.resetInfiniteLoaderCache();
            this.setState({items: data});
        });
    };

    resetInfiniteLoaderCache = () => this.infLoader.resetLoadMoreRowsCache();

    isRowLoaded = ({index}) => {
        const item = this.state.items[index];
        return !!item && typeof item.id !== 'undefined';
    };

    rowGetter = ({index}) => {
        return this.isRowLoaded({index}) ? this.state.items[index] : {};
    };

    loadMoreRows = ({startIndex, stopIndex}) => {
        return this.props.search({}, {'start_index': startIndex + 1, 'stop_index': stopIndex + 1}).then(data => {
            return new Promise((resolve) => this.setState(prevState => {
                const items = prevState.items;
                data.forEach((item, index) => {
                    items[index + startIndex] = item;
                });
                return {items};
            }, resolve));
        });
    };

    render() {
        const {params, searching, total, columns, filters, namespace } = this.props;

        return (
            <div>
                <Filters filters={filters} namespace={namespace} />

                <SearchHeader
                    searching={searching}
                    total={total}/>

                <Segment basic style={{height: "50em"}}>
                    <InfiniteLoader
                        ref={el => this.infLoader = el}
                        isRowLoaded={this.isRowLoaded}
                        threshold={100}
                        loadMoreRows={this.loadMoreRows}
                        rowCount={total}>
                        {({onRowsRendered, registerChild}) => (
                            <AutoSizer>
                                {({width, height}) => (
                                    <Table headerHeight={50}
                                           height={height}
                                           width={width}
                                           rowCount={total}
                                           ref={registerChild}
                                           onRowsRendered={onRowsRendered}
                                           rowRenderer={RowRenderer}
                                           rowGetter={this.rowGetter}
                                           rowHeight={50}>
                                        { columns }
                                    </Table>
                                )}
                            </AutoSizer>
                        )}
                    </InfiniteLoader>
                </Segment>
            </div>
        );
    }
}
