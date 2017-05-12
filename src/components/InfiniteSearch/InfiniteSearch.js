import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer, InfiniteLoader, Table } from 'react-virtualized';
import SearchHeader from '../SearchHeader/SearchHeader';
import ContentTypeFilter from '../SearchHeader/ContentTypeFilter';
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
        <div className={className}
             key={key}
             style={style}>
            { (rowData && typeof rowData.id !== 'undefined') ? columns : placeholderElement }
        </div>
    );
};

export default class InfiniteSearch extends Component {
    static propTypes = {
        error: PropTypes.any,
        search: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
        columns: PropTypes.arrayOf(PropTypes.element).isRequired,
        searchPlaceholder: PropTypes.string
    };

    state = {
        items: []
    };

    clearItems = () => {
        this.resetInfiniteLoaderCache();
        this.setState({ items: [] });
    };

    handleSearchChange = (e) => {
        const value = e.target.value;
        if (this.props.params.query !== value) {
            this.clearItems();
        }
        this.props.search({ query: value });
    };

    handleSearchCancel = () => {
        this.clearItems();
        this.props.search({ query: '' });
    };

    handleFilterChange = (name, value, clearItemsPerdicate) => {
        if (!clearItemsPerdicate || clearItemsPerdicate(value)) {
            this.clearItems();
        }
        this.props.search({ [name]: value });
    };

    resetInfiniteLoaderCache = () => this.infLoader.resetLoadMoreRowsCache();

    isRowLoaded = ({ index }) => {
        const item = this.state.items[index];
        return !!item && typeof item.id !== 'undefined';
    };

    rowGetter = ({ index }) => {
        return this.isRowLoaded({ index }) ? this.state.items[index] : {};
    };

    loadMoreRows = ({ startIndex, stopIndex }) => {
        return this.props.search({ query: this.props.params.query }, { 'start_index': startIndex, 'stop_index': stopIndex }).then(data => {
            return new Promise((resolve) => this.setState(prevState => {
                const items = prevState.items;
                data.forEach((item, index) => {
                    items[index + startIndex] = item;
                });
                return { items };
            }, resolve));
        });
    };

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
                    total={total}>
                    <TextFilter placeholder={searchPlaceholder}
                                onChange={(value) => this.handleFilterChange('query', value, v => v !== '' )}
                                value={this.props.params['query']} />
                    <ContentTypeFilter
                                onChange={(value) => this.handleFilterChange('content_type', value)}
                                value={this.props.params['content_type']} />
                </SearchHeader>
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
