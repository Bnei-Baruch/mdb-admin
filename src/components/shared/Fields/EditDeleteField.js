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
            <Form.Group inline>
                <Form.Field label={value} width={6}></Form.Field>
                <Form.Field width={4}>
                    <Button
                        compact
                        icon="pencil"
                        onClick={() => this.setMode(false)}/>
                </Form.Field>
                <Form.Field width={4}>
                    <Button
                        compact
                        icon="trash"
                        onClick={this.props.remove}/>
                </Form.Field>
            </Form.Group></Form>);

        let editMode = (<Form>
            <Form.Group inline>
                <Form.Field width={6}>
                    <Input value={value}
                           error={error}
                           onChange={this.onInputChange}/>
                </Form.Field>

                <Form.Field width={4}>
                    <Button
                        icon="checkmark"
                        color="green"
                        onClick={this.save}/>
                </Form.Field>

                <Form.Field width={4}>
                    <Button
                        icon="remove"
                        color="red"
                        onClick={this.restore}/>
                </Form.Field>
            </Form.Group>
        </Form>);

        return (isViewMode ? viewMode : editMode);
    }
}

export default EditDeleteField;
