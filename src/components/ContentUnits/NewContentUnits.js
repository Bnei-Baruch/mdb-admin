import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Flag, Form, Header, Input, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { formatError, isValidPattern } from '../../helpers/utils';

class NewContentUnits extends Component {
    static propTypes = {
        create: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        getError: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tag: null
    };


    render() {
        return(
            <div>test</div>
        )
    }
}

export default NewContentUnits;
