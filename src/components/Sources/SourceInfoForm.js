import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Header, Input, List, Menu, Segment
} from 'semantic-ui-react';

import { formatError, isValidPattern } from '../../helpers/utils';
import { EMPTY_OBJECT, SOURCE_TYPES_OPTIONS } from '../../helpers/consts';
import * as shapes from '../shapes';

class SourceInfoForm extends Component {
  static propTypes = {
    updateInfo: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    source: shapes.Source,
  };

  static defaultProps = {
    source: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);

    const { source: { pattern, description, type_id } } = props;

    this.state = {
      pattern: pattern || '',
      description: description || '',
      type_id: type_id || '',
      submitted: false,
      errors: {}
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pattern: pPattern, description: pDescription, type_id: pType_id } = state;

    if (!props.source)
      return null;

    const { source: { pattern, description, type_id } } = props;
    if (pattern !== pPattern || description !== pDescription || type_id !== pType_id) {
      return { pattern: pattern || '', description: description || '', type_id: type_id || '', };
    }
    return null;
  }

  onTypeChange = (e, { value }) => {
    this.setState({ type_id: value });
  };

  onDescriptionChange = (e, { value }) => {
    this.setState({ description: value });
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
    const { source, updateInfo }            = this.props;
    const { pattern, description, type_id } = this.state;
    updateInfo(source.id, pattern, description, type_id);

    this.setState({ submitted: true });
  };

  render() {
    const { source, getWIP, getError } = this.props;
    const wip                          = getWIP('updateInfo');
    const err                          = getError('updateInfo');

    const { pattern, description, type_id: typeID, submitted, errors } = this.state;

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
            : null
          }
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

export default SourceInfoForm;
