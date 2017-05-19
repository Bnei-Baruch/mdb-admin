import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chunk from 'lodash/chunk';
import { Grid, Segment } from 'semantic-ui-react';
import { AutoSizer, InfiniteLoader, Table } from 'react-virtualized';
import SearchHeader from '../SearchHeader/SearchHeader';
import ContentTypeFilter from '../SearchHeader/ContentTypeFilter';
import ContentSourceFilter from '../SearchHeader/ContentSourceFilter';
import TextFilter from '../SearchHeader/TextFilter';
import DateFilter from '../SearchHeader/DateFilter';
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

const MIN_STOP_INDEX = 100;

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

    // Should be removed after Search is.
    clearItems = () => {
        this.resetInfiniteLoaderCache();
        this.setState({ items: [] });
    };

    handleFilterChange = (name, value) => {
        // Start index starts from 1 in the backend.
        this.props.search({ [name]: value }, { 'start_index': 1, 'stop_index': MIN_STOP_INDEX }).then(data => {
            this.resetInfiniteLoaderCache();
            this.setState({ items: data });
        });
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
        return this.props.search({}, { 'start_index': startIndex + 1, 'stop_index': stopIndex + 1}).then(data => {
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

        const filters = [
            <DateFilter
                        placeholderText="Start Date"
                        onChange={(value) => this.handleFilterChange('start_date', value)}
                        value={params['start_date']}
                        maxDate={params['end_date']} />,
                    <DateFilter
                        placeholderText="End Date"
                        onChange={(value) => this.handleFilterChange('end_date', value)}
                        value={params['end_date']}
                        minDate={params['start_date']} />,
                    <ContentTypeFilter onChange={(value) => this.handleFilterChange('content_type', value)}
                                       value={params['content_type']} />,
                    <ContentSourceFilter onChange={(value) => this.handleFilterChange('content_source', value)}
                                         value={params['content_source']} />
        ];

        const filterChunks = chunk(filters, 4);

        return (
            <div className="InfiniteSearch">
                <Segment compact>
                <Grid>
                    <Grid.Row columns="1">
                        <Grid.Column>
                            <TextFilter placeholder={searchPlaceholder}
                                        onChange={(value) => this.handleFilterChange('query', value)}
                                        value={params['query']} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="1">
                        <Grid.Column>
                            <Grid>
                                {
                                    filterChunks.map((group, idx) => (
                                        <Grid.Row columns="4" key={idx}>
                                            {
                                                group.map((filter, idx2) => <Grid.Column key={idx2}>{ filter }</Grid.Column>)
                                            }
                                        </Grid.Row>
                                    ))
                                }
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </Segment>
                <SearchHeader
                    searching={searching}
                    error={error}
                    total={total} />
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
