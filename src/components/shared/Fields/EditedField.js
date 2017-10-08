import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form } from 'semantic-ui-react';

class EditedField extends PureComponent {

  static  propTypes   = {
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
      return this.setState({ error });
    }

    this.setState({ value, error });
  };

  save = () => {
    const { value, error } = this.state;
    if (error) {
      return;
    }

    this.props.save(value);
    this.setMode();
  };

  setMode = (isView = true) => {
    this.setState({ isViewMode: isView });
  };

  render() {
    const { isViewMode, value, error } = this.state;

    let viewMode = (<Form>
      <Form.Group inline>
        <Form.Field label={value} width={10}></Form.Field>
        <Form.Field>
          <Button
            floated="right"
            icon="pencil"
            size="small"
            onClick={() => this.setMode(false)} />
        </Form.Field>
      </Form.Group></Form>);

    let editMode = (<Form>
      <Form.Group inline>
        <Form.Field width={10}>
          <Input value={value}
                 error={error}
                 onChange={this.onInputChange} />
        </Form.Field>
        <Form.Field width={4}>
          <Button
            floated="right"
            icon="checkmark"
            size="small"
            color="green"
            onClick={this.save} />
        </Form.Field>
      </Form.Group>
    </Form>);

    return (isViewMode ? viewMode : editMode);
  }
}

export default EditedField;
