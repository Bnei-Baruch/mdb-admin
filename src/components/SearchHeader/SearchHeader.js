import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Spinner from '../Spinner/Spinner';
import './SearchHeader.css';

function SearchHeader(props) {
    const {
        searching,
        total,
        error,
        children,
    } = props;

    return (
        <div className="ui fluid search SearchHeader">
            { children }
            {
                searching &&
                <div className="SearchHeader__spinnerContainer">
                    <Spinner/>
                    <span className="SearchHeader__searchText">Searching...</span>
                </div>
            }
            {!!error && <span className="SearchHeader__error">{error}</span>}
            <div>Total: {total}</div>
        </div>
    );
}

SearchHeader.propTypes = {
    searching: PropTypes.bool,
    searchText: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    total: PropTypes.number,
    handleSearchChange: PropTypes.func,
    handleSearchCancel: PropTypes.func,
    error: PropTypes.any
};

SearchHeader.defaultProps = {
    searching: false,
    searchText: '',
    searchPlaceholder: 'search...',
    total: 0,
    handleSearchChange: noop,
    handleSearchCancel: noop,
    error: null
};

export default SearchHeader;
