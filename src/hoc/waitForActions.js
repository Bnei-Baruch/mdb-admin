import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { resolveOnActions } from '../sagas/waitForAction';

const waitForActions = (options) => (WrappedComponent) => {
    const actionsToWaitFor = Array.isArray(options.actions) ? options.actions : [options.actions];
    const LoadingComponent = options.loader || (() => null);

    class WaitForActions extends Component {

        state = {
            isComplete: false
        };

        componentDidMount() {
            resolveOnActions(actionsToWaitFor).then(() => this.setState({ isComplete: true });
        }

        render() {
            if (this.state.isComplete) {
                return <WrappedComponent {...this.props} />;
            } else {
                return <LoadingComponent {...this.props} />;
            }
        }
    };

    // TODO (yaniv): change displayName
};

export default waitForActions;
