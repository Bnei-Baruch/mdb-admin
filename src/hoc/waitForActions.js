import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { resolveOnActions } from '../sagas/waitForActions';

const waitForActions = (options) => (WrappedComponent) => {
    let actionsToWaitFor = options.actions;
    if (actionsToWaitFor && !Array.isArray(actionsToWaitFor)) {
        actionsToWaitFor = [actionsToWaitFor];
    }
    const LoadingComponent = options.LoadingComponent || (() => null);

    class WaitForActions extends Component {

        static propTypes = {
            dispatch: PropTypes.func.isRequired
        };

        state = {
            isComplete: false
        };

        componentDidMount() {
            resolveOnActions(actionsToWaitFor, this.props.dispatch, options.timeout)
                .then(() => this.setState({ isComplete: true }));
        }

        render() {
            if (this.state.isComplete) {
                return <WrappedComponent {...this.props} />;
            } else {
                return <LoadingComponent {...this.props} />;
            }
        }
    };

    return connect()(WaitForActions);

    // TODO (yaniv): change displayName
};

export default waitForActions;
