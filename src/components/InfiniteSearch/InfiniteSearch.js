import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import chunk from 'lodash/chunk';
import { Segment, Form } from 'semantic-ui-react';
import { AutoSizer, InfiniteLoader, Table } from 'react-virtualized';
import TextFilter from '../Filters/TextFilter';
import DateFilter from '../Filters/DateFilter';
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
        search: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
        columns: PropTypes.arrayOf(PropTypes.element).isRequired,
        filters: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            Filter: PropTypes.any, // component
            props: PropTypes.func
        })),
        searchPlaceholder: PropTypes.string,
        searchError: PropTypes.any,
    };

    static defaultProps = {
        filters: [],
        searchPlaceholder: '',
        searchError: undefined
    }

    state = {
        items: [],
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
        const { params, searching, total, searchPlaceholder, columns, filters } = this.props;
        const filterChunks = chunk(filters, 4);

        return (
            <div className="InfiniteSearch">
                <Segment fluid color="blue">
                    <Form>
                        <Form.Group>
                            <Form.Field width={8}>
                                <label>Query:</label>
                                <TextFilter placeholder={searchPlaceholder}
                                            onChange={(value) => this.handleFilterChange('query', value)}
                                            value={params['query']} />
                            </Form.Field>
                            <Form.Field width={4}>
                                <label>Start Date:</label>
                                <DateFilter placeholder="YYYY-MM-DD"
                                            onChange={(value) => this.handleFilterChange('start_date', value)}
                                            value={params['start_date']}
                                            maxDate={params['end_date']} />
                            </Form.Field>
                            <Form.Field width={4}>
                                <label>End Date:</label>
                                <DateFilter placeholder="YYYY-MM-DD"
                                            onChange={(value) => this.handleFilterChange('end_date', value)}
                                            value={params['end_date']}
                                            minDate={params['start_date']} />
                            </Form.Field>
                        </Form.Group>
                        {
                            filterChunks.map((group, idx) => (
                                <Form.Group key={idx}>
                                    {
                                        group.map((filter, idx2) => (
                                            <Form.Field key={idx2} width={4}>
                                                <label>{filter.label}:</label>
                                                <filter.Filter
                                                    onChange={(value) => this.handleFilterChange(filter.name, value)}
                                                    value={params[filter.name]}
                                                    {...(filter.props || noop)(params)}
                                                />
                                            </Form.Field>
                                        ))
                                    }
                                </Form.Group>
                            ))
                        }
                    </Form>
                </Segment>
                <SearchHeader
                    searching={searching}
                    total={total} />
                <Segment color="blue" className="InfiniteSearch__loader">
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
                </Segment>
            </div>
        );
    }
}
