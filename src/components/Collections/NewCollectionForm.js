import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Flag, Form, Header, Input, Message, Segment, Select} from 'semantic-ui-react';

import {
    LANG_ENGLISH,
    LANG_HEBREW,
    LANG_RUSSIAN,
    LANG_SPANISH,
    MAJOR_LANGUAGES,
    COLLECTIONS
} from '../../helpers/consts';
import * as shapes from '../shapes';
import {formatError, isValidPattern} from '../../helpers/utils';

class NewCollectionForm extends Component {
    static propTypes = {
        create: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        getError: PropTypes.func.isRequired,
        collection: shapes.Collection,
    };

    static defaultProps = {
        collection: null
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            typeId: '',
            isActive: '',
            pattern: '',
            labels: {
                [LANG_HEBREW]: ''
            },
            submitted: false,
            errors: {},
        };
    }

    handleSubmit() {

    }

    render() {

        const {getWIP, getError} = this.props;
        const wip = getWIP('create');
        const err = getError('create');
        const {submitted, errors} = this.state;
        return (
            <Segment.Group>
                <Segment basic>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <label htmlFor="type_id">Collection type</label>
                            <Select id="type_id" placeholder='Select collection type' options={COLLECTIONS}/>
                        </Form.Field>

                        {
                            errors.labels ?
                                <Message negative content="At least one translation is required"/> :
                                null
                        }
                    </Form>
                </Segment>

                <Segment clearing attached="bottom" size="tiny">
                    {submitted && err ?
                        <Header
                            inverted
                            content={formatError(err)}
                            color="red"
                            icon="warning sign"
                            floated="left"
                            size="tiny"
                            style={{marginTop: '0.2rem', marginBottom: '0'}}
                        />
                        : null}
                    <Button
                        primary
                        content="Save"
                        size="tiny"
                        floated="right"
                        loading={wip}
                        disabled={wip}
                        onClick={this.handleSubmit}
                    />
                </Segment>
            </Segment.Group>
        )
    }
}

export default NewCollectionForm;
