import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, InfiniteLoader, Table } from 'react-virtualized';
import SearchHeader from '../SearchHeader/SearchHeader';
import './InfiniteSearch.css';

import 'react-virtualized/styles.css';

const RowRenderer = ({ className, columns, key, style, index, rowData }) => {
    const placeholderElement = (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%', width: '100%'
            }}
        >
            <div className="placeholder" />
        </div>
    );

    return (
        <div
            className={className}
            key={key}
            style={style}
        >
             { (rowData && rowData.id) ? columns : placeholderElement }
        </div>
    );
};

export default class InfiniteSearch extends Component {
    static propTypes = {
        resultItems: PropTypes.array.isRequired,
        error: PropTypes.any,
        search: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
        columns: PropTypes.arrayOf(PropTypes.element).isRequired,
        searchPlaceholder: PropTypes.string
    };

    handleSearchChange = (e) => {
        const value = e.target.value;
        const isNewSearch = this.props.params.query !== value;

        if (isNewSearch) {
            this.resetInfiniteLoaderCache();
        }

        this.props.search({ query: value }, isNewSearch);
    };

    handleSearchCancel = () => {
        this.resetInfiniteLoaderCache();
        this.props.search({ query: '' }, true);
    };

    resetInfiniteLoaderCache = () => this.infLoader.resetLoadMoreRowsCache();

    isRowLoaded = ({ index }) => {
        const item = this.props.resultItems[index];
        return item && typeof item.id !== 'undefined';
    };

    rowGetter = ({ index }) => {
        return this.isRowLoaded({ index }) ? this.props.resultItems[index] : {};
    };

    loadMoreRows = ({ startIndex, stopIndex }) =>
        this.props.search({ query: this.props.params.query }, false, startIndex, stopIndex);

    render() {
        const { params, searching, error, total, searchPlaceholder, columns } = this.props;

        return (
            <div className="InfiniteSearch">
                <SearchHeader
                    searchText={params.query}
                    searchPlaceholder={searchPlaceholder}
                    handleSearchChange={this.handleSearchChange}
                    handleSearchCancel={this.handleSearchCancel}
                    searching={searching}
                    error={error}
                    total={total}
                />
                <div className="InfiniteSearch__loader">
                    <InfiniteLoader
                        ref={el => this.infLoader = el}
                        isRowLoaded={this.isRowLoaded}
                        threshold={100}
                        loadMoreRows={this.loadMoreRows}
                        rowCount={total} >
                        {({ onRowsRendered, registerChild }) => (
                            <AutoSizer>
                                {({ width, height }) => (
                                    <Table headerHeight={50}
                                           height={height}
                                           width={width}
                                           rowCount={total}
                                           ref={registerChild}
                                           onRowsRendered={onRowsRendered}
                                           rowRenderer={RowRenderer}
                                           rowGetter={this.rowGetter}
                                           rowHeight={50} >
                                        { columns }
                                    </Table>
                                )}
                            </AutoSizer>
                        )}
                    </InfiniteLoader>
                </div>
            </div>
        );
    }
}
