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
    } = props;

    return (
        <div className="ui fluid SearchHeader">
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
    total: PropTypes.number,
    error: PropTypes.any
};

SearchHeader.defaultProps = {
    searching: false,
    total: 0,
    error: null
};

export default SearchHeader;
