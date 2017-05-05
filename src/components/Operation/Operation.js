import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OperationInfo from './OperationInfo/OperationInfo';

class Operation extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        return (
            <OperationInfo id={this.props.match.params.id} />
        );
    }
}

Operation.Info = OperationInfo;

export default Operation;
