import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';

const searcher = (options) => (WrappedComponent) => {
    invariant(
        isFunction(options.request),
        'options.request must be a function'
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

    const DEFAULT_STOP_INDEX = 100;

    return class Searcher extends Component {

        static propTypes = {
            urlParams: PropTypes.object
        };

        static defaultProps = {
            urlParams: {}
        };

        state = {
            searching: false,
            items: [],
            params: {},
            total: 0,
            error: null
        };

        componentDidMount() {
            if (searchOnMount) {
                this.search();
            }
        }

        search = (params = {}, isNewSearch = false, startIndex = 0, stopIndex = DEFAULT_STOP_INDEX) => {
            return new Promise((resolve, reject) => {
                onSearching();
                this.setState({
                    searching: true,
                    params
                }, () => {
                    request({ ...params, start_index: startIndex, stop_index: stopIndex }, this.props.urlParams).then(response => {
                        onSuccess(response);
                        const { data, total } = response.data;
                        this.setState(prevState => {
                            const items = isNewSearch ? [] : prevState.items;
                            data.forEach((item, index) => {
                                items[index + startIndex] = item;
                            });

                            return {
                                total,
                                items,
                                searching: false,
                                error: null
                            };
                        }, () => resolve());
                    }).catch(error => {
                        onError(error);
                        this.setState({
                            searching: false,
                            error: error
                        }, () => reject());
                    });
                });
            });
        };

        render() {
            return (
                <WrappedComponent search={this.search}
                                  searching={this.state.searching}
                                  resultItems={this.state.items}
                                  params={this.state.params}
                                  searchError={this.state.error}
                                  total={this.state.total}
                                  {...this.props} />
            );
        }
    };

    // TODO (yaniv): change displayName
};

export default searcher;
