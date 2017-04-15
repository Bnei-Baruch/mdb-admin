import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AutoSizer, Column, InfiniteLoader, Table } from 'react-virtualized';
import apiClient from '../../helpers/apiClient';
import Spinner from '../Spinner/Spinner';

import 'react-virtualized/styles.css';
import '../Files/Files.css';

const RowRenderer = ({ className, columns, key, style, index, rowData }) => {
    if(!rowData || !rowData.id) {
        return (
            <div
                className={className}
                key={key}
                style={style}
            >
                 <div
                    className="flex-center-center"
                    style={{height: '100%', width: '100%'}}
                >
                    <div className="placeholder" />
                 </div>
            </div>
        );
    }

    return (
        <div
            className={className}
            key={key}
            style={style}
        >
             {columns}
        </div>
    );
};

const LinkToFileCellRenderer = ({ cellData, dataKey }) =>
    <Link to={`/content_units/${cellData}`}>{cellData}</Link>;

const Header = (props) => {
    const removeIconStyle = props.showRemoveIcon ? {} : { visibility: 'hidden' };

    return (
        <div className='ui fluid search'
             style={{
                 display: 'flex',
                 flexDirection: 'row',
                 justifyContent: 'space-between',
                 paddingLeft: 10,
                 paddingRight: 10}} >
            <div>
                <div className='ui icon input'>
                    <input className='prompt'
                           type='text'
                           placeholder='Search content units...'
                           value={props.searchText}
                           onChange={props.handleSearchChange} />
                    <i className='search icon' />
                </div>
                <i className='remove icon'
                   onClick={props.handleSearchCancel}
                   style={removeIconStyle} />
            </div>
            <div className='flex-space-between-center'>
                {
                    props.loadingFiles &&
                    <span className='flex-space-between-center'>
                            <Spinner/>
                            <span style={{marginLeft: '10px'}}>Searching...</span>
                        </span>
                }
                {!!props.error && <span style={{color: 'red', marginLeft: '10px'}}>{props.error}</span>}
            </div>
            <div className='flex-space-between-center'>
                <span>Total: {props.total}</span>
            </div>
        </div>
    );
};

class ContentUnits extends Component {
    firstLimit = 100;

    state = {
        // Should be eventually props.
        files: [],
        resetFiles: false,
        total: 0,

        loadingFiles: false,
        error: '',

        // Should be eventually state.
        showRemoveIcon: false,
        searchText: '',
    };

    componentDidMount = () => {
        this.searchFiles('', 0, this.firstLimit);
    };

    handleSearchChange = (e) => {
        this.searchFiles(e.target.value, 0, this.firstLimit);
    };

    handleSearchCancel = () => {
        this.searchFiles('', 0, this.firstLimit);
    };

    searchFiles = (searchText, startIndex, stopIndex) => {
        console.log('Search text:', searchText, 'Fetching start: ' + startIndex + ' stop: ' + stopIndex);
        this.setState((prevState) => {
            const newState = {
                loadingFiles: true,
                searchText,
                showRemoveIcon: searchText !== '',
                resetFiles: prevState.searchText !== searchText,
            };
            if (newState.resetFiles) {
                this.refs.inf.resetLoadMoreRowsCache();
            }
            return newState;
        }, () => {
            apiClient.get('/rest/content_units/', {
                params: {
                    start_index: startIndex,
                    stop_index: stopIndex,
                    query: searchText
                }
            }).then(response => {
                const {total, data} = response.data;
                this.setState((prevState) => {
                    const newFiles = prevState.resetFiles ? [] : prevState.files;
                    data.forEach((f, i) => {
                        newFiles[i + startIndex] = f;
                        f.index = i + startIndex;
                    });
                    return {
                        loadingFiles: false,
                        resetFiles: false,
                        files: newFiles,
                        total,
                        error: '',
                    };
                });
            }).catch((e) => {
                console.log(e);
                this.setState({loadingFiles: false, error: 'Error loading files: ' + e});
            })
        });
    };

    isRowLoaded = ({ index }) => {
        const item = this.state.files[index];
        return item && typeof item.id !== 'undefined';
    };

    rowGetter = ({ index }) =>
        this.isRowLoaded({ index }) ? this.state.files[index] : {};

    loadMoreRows = ({ startIndex, stopIndex }) =>
        this.searchFiles(this.state.searchText, startIndex, stopIndex);

    render() {
        const { showRemoveIcon, searchText, loadingFiles, error, total } = this.state;

        return (
            <div style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}>
                <Header
                    showRemoveIcon={showRemoveIcon}
                    searchText={searchText}
                    handleSearchChange={this.handleSearchChange}
                    handleSearchCancel={this.handleSearchCancel}
                    loadingFiles={loadingFiles}
                    error={error}
                    total={total}
                />
                <div style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}>
                    <InfiniteLoader
                        ref="inf"
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
                                        <Column label='Index'
                                                cellDataGetter={({rowData}) => rowData.index}
                                                dataKey='index'
                                                width={60} />
                                        <Column label='ID'
                                                dataKey='id'
                                                cellRenderer={LinkToFileCellRenderer}
                                                width={80} />
                                        <Column label='UID'
                                                dataKey='uid'
                                                width={80} />
                                        <Column label='Name'
                                                dataKey='name'
                                                width={160}
                                                flexGrow={1} />
                                        <Column label='Created at'
                                                dataKey='file_created_at'
                                                width={80}
                                                flexGrow={1} />
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

export default ContentUnits;
