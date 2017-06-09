import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Input, List, Menu, Segment } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { formatError, isValidPattern } from '../../helpers/utils';
import { SOURCE_TYPES_OPTIONS } from '../../helpers/consts';

class SourceInfoForm extends Component {

  static propTypes = {
    updateInfo: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    source: shapes.Source,
  };

  static defaultProps = {
    source: {},
  };

  constructor(props) {
    super(props);

    const { source } = props;

    this.state = {
      pattern: source.pattern || '',
      description: source.description || '',
      type_id: source.type_id,
      submitted: false,
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.source !== nextProps.source) {
      this.setState({
        pattern: nextProps.source.pattern || '',
        description: nextProps.source.description || '',
        type_id: nextProps.source.type_id,
      });
    }
  }

  onTypeChange = (e, { value }) => {
    this.setState({ type_id: value });
  };

  onDescriptionChange = (e, { value }) => {
    this.setState({ description: value });
  };

  onPatternChange = (e, { value }) => {
    const errors = this.state.errors;
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
    const { source, getWIP, getError }                         = this.props;
    const wip                                                  = getWIP('updateInfo');
    const err                                                  = getError('updateInfo');
    const { pattern, description, type_id, submitted, errors } = this.state;

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
                value={type_id}
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

            <Form.Field >
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
          {submitted && err ?
            <Header
              inverted
              content={formatError(err)}
              color="red"
              icon="warning sign"
              floated="left"
              style={{ marginTop: '0.2rem', marginBottom: '0' }}
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
      </div>
    );
  };
}

export default SourceInfoForm;
