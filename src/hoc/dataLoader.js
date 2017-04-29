import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';

const dataLoader = (propsToPromise) => (WrappedComponent) => {
    return class DataLoader extends Component {
        state = {
            loading: true,
            data: undefined,
            error: null
        };

        componentDidMount() {
            this.loadData();
        }

        componentWillReceiveProps(nextProps) {
            this.loadData();
        }

        loadData = () => {
            this.setState({ loading: true });
            propsToPromise(this.props)
                .then(response => this.setState({ data: response.data, loading: false }))
                .catch(error => this.setState({ error, loading: false }));
        };

        render() {
            return (
                <WrappedComponent {...this.state}
                                  {...this.props} />
            );
        }
    };

    // TODO (yaniv): change displayName
};

export default dataLoader;
