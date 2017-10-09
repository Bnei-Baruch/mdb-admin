import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button, Form, Input } from 'semantic-ui-react';

class EditedField extends PureComponent {

  static propTypes = {
    onSave: PropTypes.func,
    value: PropTypes.string
  };

  static defaultProps = {
    onSave: noop,
    value: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isViewMode: true
    };
  }

  handleInputChange = (e, data) =>
    this.setState({ value: data.value });

  handleSave = () => {
    const { value } = this.state;
    this.props.onSave(value);
    this.setState({ isViewMode: true });
  };

  setEditMode = () =>
    this.setState({ isViewMode: false });

  render() {
    const { isViewMode, value } = this.state;

    if (isViewMode) {
      return (
        <Form>
          <Form.Group inline>
            <Form.Field label={value} width={10} />
            <Form.Field>
              <Button
                floated="right"
                icon="pencil"
                size="small"
                onClick={this.setEditMode}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      );
    }

    return (
      <Form>
        <Form.Group inline>
          <Form.Field width={10}>
            <Input value={value} onChange={this.handleInputChange} />
          </Form.Field>
          <Form.Field width={4}>
            <Button
              floated="right"
              icon="checkmark"
              size="small"
              color="green"
              onClick={this.handleSave}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default EditedField;
