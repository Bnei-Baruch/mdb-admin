import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Flag, Form, Header, Input, Message, Segment } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { formatError, isValidPattern } from '../../helpers/utils';
import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, MAJOR_LANGUAGES } from '../../helpers/consts';

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
    }
}

export default NewContentUnits;
