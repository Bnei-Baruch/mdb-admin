import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';
import { connect } from 'react-redux';
import { setParams, getParams } from '../redux/modules/search';

const searcher = (options) => (WrappedComponent) => {
    invariant(
        isFunction(options.request),
        'options.request must be a function'
    );

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

    const DEFAULT_STOP_INDEX = 100;

    class Searcher extends Component {

        static propTypes = {
            defaultParams: PropTypes.object,
            params: PropTypes.object,
            setParams: PropTypes.func.isRequired
        };

        static defaultProps = {
            defaultParams: {},
            params: {}
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

        search = (updateParams = {}, isNewSearch = false, startIndex = 0, stopIndex = DEFAULT_STOP_INDEX) => {
            return new Promise((resolve, reject) => {
                onSearching();
                const oldParams = this.props.params;
                this.props.setParams(updateParams);
                this.setState({
                    searching: true,
                }, () => {
                    request({ ...this.props.defaultParams, ...oldParams, ...updateParams , start_index: startIndex, stop_index: stopIndex }).then(response => {
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
                        console.error(error);
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
                                  params={this.props.params}
                                  searchError={this.state.error}
                                  total={this.state.total}
                                  {...this.props} />
            );
        }
    };

    return connect(
        state => ({
            params: getParams(state.search, options.name)
        }),
        {
            setParams: (params) => setParams(options.name, params)
        }
    )(Searcher);

    // TODO (yaniv): change displayName
};

export default searcher;
