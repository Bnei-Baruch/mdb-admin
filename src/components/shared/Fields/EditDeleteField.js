import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Grid,Table } from 'semantic-ui-react';

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


        let viewMode = (<Table.Row>
            <Table.Cell> {value}</Table.Cell >
            <Table.Cell collapsing>
                <Button
                    bordered
                    compact
                    icon="pencil"
                    onClick={() => this.setMode(false)}
                    />
            </Table.Cell>
            <Table.Cell collapsing>
                <Button
                    bordered
                    compact
                    icon="trash"
                    onClick={this.props.remove}
                    />
            </Table.Cell>
        </Table.Row>);

        let editMode = (<Table.Row>
            <Table.Cell>
                <Input value={value}
                       error={error}
                       onChange={this.onInputChange}/>
            </Table.Cell >
            <Table.Cell collapsing>
                <Button
                    bordered
                    icon="checkmark"
                    color="green"
                    onClick={this.save}
                    />
            </Table.Cell>
            <Table.Cell collapsing>
                <Button
                    bordered
                    icon="remove"
                    color="red"
                    onClick={this.restore}
                    />
            </Table.Cell>
        </Table.Row>);

        return (<Table collapsing compact><Table.Body>
            {isViewMode ? viewMode : editMode}
        </Table.Body></Table>);
    }
}

export default EditDeleteField;
