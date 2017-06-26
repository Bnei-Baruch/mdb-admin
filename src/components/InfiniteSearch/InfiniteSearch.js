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

export default class InfiniteSearch extends Component {
    static propTypes = {
        namespace: PropTypes.string.isRequired,
        search: PropTypes.func.isRequired,
        columns: PropTypes.arrayOf(PropTypes.element).isRequired,
        filters: PropTypes.arrayOf(filterConfigShape),
        resultItems: PropTypes.array.isRequired,
        error: PropTypes.object
    };

    static defaultProps = {
        filters: [],
        error: null
    };

    // Should be remove when new search starts (new search means filters have changed)
    resetInfiniteLoaderCache = () => this.infLoader.resetLoadMoreRowsCache();

    isRowLoaded = ({index}) => {
        const item = this.props.resultItems[index];
        return !!item && typeof item.id !== 'undefined';
    };

    rowGetter = ({index}) => this.props.resultItems[index] || {};

    // FIXME: (yaniv) wrap search with promise that resolves when search is successful or failed for this namespace and startIndex + stopIndex
    loadMoreRows = ({ startIndex, stopIndex }) => this.props.search({}, startIndex, stopIndex);

    render() {
        const {params, searching, total, columns, filters, namespace } = this.props;

        return (
            <div>
                <Filters filters={filters} namespace={namespace} />
                <SearchHeader searching={searching} total={total} />
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
