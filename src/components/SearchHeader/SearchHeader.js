import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';
import Spinner from '../Spinner/Spinner';
import './SearchHeader.css';

function SearchHeader(props) {
    const {
        searching,
        searchText,
        searchPlaceholder,
        total,
        handleSearchChange,
        handleSearchCancel,
        error
    } = props;

    const removeIconClass = classNames(
        'remove icon',
        { 'SearchHeader__removeIcon--hidden': searchText === ''}
    );

    return (
        <div className="ui fluid search SearchHeader">
            <div>
                <div className="ui icon input">
                    <input className="prompt"
                           type="text"
                           placeholder={searchPlaceholder}
                           value={searchText}
                           onChange={handleSearchChange} />
                    <i className="search icon" />
                </div>
                <i className={removeIconClass} onClick={handleSearchCancel} />
            </div>
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
