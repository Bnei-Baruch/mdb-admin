import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import { connect } from 'react-redux';
import { actions as searchActions, selectors as searchSelectors } from '../redux/modules/search';
import { setParams, selectors as filterSelectors } from '../redux/modules/filters';

const MIN_STOP_INDEX = 100;

const searcher = (options) => (WrappedComponent) => {
    invariant(
        isFunction(options.request),
        'options.request must be a function'
    );

    const namespace = options.name;

    invariant(
        !!options.name,
        'options.name must not be empty'
    );

    const defaultOptions = {
        onSearching: noop,
        onSuccess: noop,
        onError: noop,
        searchOnMount: false,
    };

    const { onSearching, onSuccess, onError, searchOnMount, request } = {
        ...defaultOptions,
        ...options
    };

    class Searcher extends Component {

        static propTypes = {
            items: PropTypes.array,
            total: PropTypes.number,
            searchItems: PropTypes.func.isRequired,
            error: PropTypes.any,
            isSearching: PropTypes.bool
        };

        static defaultProps = {
            items: [],
            total: 0,
            error: null,
            isSearching: false
        };

        componentDidMount() {
            if (searchOnMount) {
                this.searchItems();
            }
        }

        searchItems = (params = {}, startIndex = 0, stopIndex = MIN_STOP_INDEX) => {
            this.props.searchItems(namespace, startIndex, stopIndex, params);
        }

        render() {
            return (
                <WrappedComponent search={this.searchItems}
                                  searching={this.props.isSearching}
                                  resultItems={this.props.items}
                                  params={this.props.params}
                                  searchError={this.props.error}
                                  total={this.props.total}
                                  namespace={options.name}
                                  {...this.props} />
            );
        }
    };

    return connect(
        state => ({
            params: filterSelectors.getFilters(state.filters, namespace),
            items: searchSelectors.getResultItems(state.search, namespace),
            total: searchSelectors.getTotal(state.search, namespace),
            error: searchSelectors.getError(state.search, namespace),
            isSearching: searchSelectors.getIsSearching(state.search, namespace)
        }),
        searchActions
    )(Searcher);

    // TODO (yaniv): change displayName
};

export default searcher;
