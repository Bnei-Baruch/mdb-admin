import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Input, List, Menu, Segment } from 'semantic-ui-react';

import { formatError, isValidPattern } from '../../helpers/utils';
import { SOURCE_TYPES_OPTIONS } from '../../helpers/consts';
import * as shapes from '../shapes';

class SourceInfoForm extends Component {
  constructor(props) {
    super(props);

    const { source: { pattern, description, type_id, position } } = props;

    this.state = { pattern, description, type_id, submitted: false, position, errors: {} };
  }

  static getDerivedStateFromProps(props, state) {
    const { source: { pattern, description, type_id, position } } = props;
    if (type_id !== state.type_id) {
      return { pattern, description, type_id, position };
    }
    return null;
  }

  onTypeChange = (e, { value }) => {
    this.setState({ type_id: value });
  };

  onDescriptionChange = (e, { value }) => {
    this.setState({ description: value });
  };

  onPositionChange = (e, { value }) => {
    this.setState({ position: Number(value) });
  };

  onPatternChange = (e, { value }) => {
    const { errors } = this.state;
    if (isValidPattern(value)) {
      delete errors.pattern;
    } else {
      errors.pattern = true;
    }

    this.setState({ pattern: value, errors });
  };

  handleSubmit = () => {
    const { source, updateInfo }                      = this.props;
    const { pattern, description, type_id, position } = this.state;
    updateInfo(source.id, pattern, description, type_id, position);

    this.setState({ submitted: true });
  };

  render() {
    const { source, getWIP, getError } = this.props;
    const wip                          = getWIP('updateInfo');
    const err                          = getError('updateInfo');

    const { pattern, description, type_id: typeID, position, submitted, errors } = this.state;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Source Info" size="medium" color="blue" />
          </Menu.Item>
        </Menu>

        <Segment attached>
          <Form onSubmit={this.handleSubmit}>
            <List horizontal floated="right">
              <List.Item><strong>ID:</strong>&nbsp;{source.id}</List.Item>
              <List.Item><strong>UID:</strong>&nbsp;{source.uid}</List.Item>
            </List>

            <Form.Field>
              <label htmlFor="type">Type</label>
              <Form.Select
                id="type"
                placeholder="Type"
                value={typeID}
                options={SOURCE_TYPES_OPTIONS}
                onChange={this.onTypeChange}
              />
            </Form.Field>

            <Form.Field error={errors.pattern}>
              <label htmlFor="pattern">Pattern</label>
              <Input
                id="pattern"
                placeholder="Pattern"
                value={pattern}
                onChange={this.onPatternChange}
              />
              <small className="helper">
                Used in physical file names.
                English words separated with &lsquo; -&rsquo;
              </small>
            </Form.Field>

            <Form.Field>
              <label htmlFor="description">Description</label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={this.onDescriptionChange}
              />
              <small className="helper">A short description about this source</small>
            </Form.Field>

            <Form.Field>
              <label htmlFor="position">Position</label>
              <Input
                id="position"
                type="number"
                placeholder="Position"
                value={position}
                onChange={this.onPositionChange}
              />
            </Form.Field>
          </Form>
        </Segment>

        <Segment clearing attached="bottom" size="tiny">
          {submitted && err
            ? (
              <Header
                inverted
                content={formatError(err)}
                color="red"
                icon="warning sign"
                floated="left"
                style={{ marginTop: '0.2rem', marginBottom: '0' }}
              />
            )
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
      </div>
    );
  }
}

SourceInfoForm.propTypes = {
  updateInfo: PropTypes.func.isRequired,
  getWIP: PropTypes.func.isRequired,
  getError: PropTypes.func.isRequired,
  source: shapes.Source,
};

SourceInfoForm.defaultProps = {
  source: {
    pattern: '',
    description: '',
    type_id: '',
    position: ''
  },
};

export default SourceInfoForm;
