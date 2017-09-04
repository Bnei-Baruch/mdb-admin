import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Grid,Table,Form } from 'semantic-ui-react';

class EditDeleteField extends PureComponent {

    static  propTypes = {
        remove: PropTypes.func,
        save: PropTypes.func,
        value: PropTypes.string
    };
    static defaultProps = {
        remove: null,
        save: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            pattern: '',
            error: false,
            isViewMode: true
        };
    }

    onInputChange = (e, { value }) => {
        let error = false;
        if (!value && value !== '0') {
            value = this.state.value;
            error = true;
            return this.setState({error});
        }

        this.setState({value, error});
    };

    save = () => {
        const { value, error } = this.state;
        if (error) {
            return;
        }

        this.props.save(value);
        this.setMode();
    };

    restore = () => {
        const value = this.props.value;

        this.setState({isViewMode: true, value});
    };

    setMode = (isView = true) => {
        this.setState({isViewMode: isView});
    };

    render() {
        const { isViewMode, value, error } = this.state;


        let viewMode = (<Form>
            <Form.Group>
                <Form.Field>
                </Form.Field>
            <Form.Label>{value}</Form.Label>
            <Button
                bordered
                compact
                icon="pencil"
                onClick={() => this.setMode(false)}
                />
            <Button
                bordered
                compact
                icon="trash"
                onClick={this.props.remove}
                />
        </Form.Group></Form>);

        let editMode = (<Form>
            <Form.Group>
                <Input value={value}
                       error={error}
                       width={10}
                       onChange={this.onInputChange}/>
                <Button
                    bordered
                    icon="checkmark"
                    color="green"
                    onClick={this.save}
                    />
                <Button
                    bordered
                    icon="remove"
                    color="red"
                    onClick={this.restore}
                    />
            </Form.Group>
        </Form>);

        return (isViewMode ? viewMode : editMode);
    }
}

export default EditDeleteField;
