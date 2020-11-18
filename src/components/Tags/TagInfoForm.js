import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button, Form, Header, Input, List, Menu, Segment
} from 'semantic-ui-react';

import { EMPTY_OBJECT } from '../../helpers/consts';
import { formatError, isValidPattern } from '../../helpers/utils';
import * as shapes from '../shapes';

class TagInfoForm extends Component {
  static propTypes = {
    updateInfo: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    tag: shapes.Tag,
  };

  static defaultProps = {
    tag: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);

    this.state = {
      pattern: props.tag.pattern || '',
      description: props.tag.description || '',
      submitted: false,
      errors: {}
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.tag) return null;

    const { pattern: nPattern, description: nDescription } = props.tag;
    const { pattern, description }                         = state;
    if (pattern !== nPattern || description !== nDescription) {
      return { pattern: nPattern, description: nDescription };
    }

    return null;
  }

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
    const { tag, updateInfo }      = this.props;
    const { pattern, description } = this.state;

    updateInfo(tag.id, pattern, description);
    this.setState({ submitted: true });
  };

  render() {
    const { tag, getWIP, getError } = this.props;
    const wip                       = getWIP('updateInfo');
    const err                       = getError('updateInfo');

    const {
      pattern, description, submitted, errors
    } = this.state;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Tag Info" size="medium" color="blue" />
          </Menu.Item>
        </Menu>

        <Segment attached>
          <Form onSubmit={this.handleSubmit}>
            <List horizontal floated="right">
              <List.Item><strong>ID:</strong>&nbsp;{tag.id}</List.Item>
              <List.Item><strong>UID:</strong>&nbsp;{tag.uid}</List.Item>
              <List.Item>
                <strong>Parent ID:</strong>&nbsp;
                {
                  tag.parent_id
                    ? <Link to={`/tags/${tag.parent_id}`}>{tag.parent_id}</Link>
                    : 'none'
                }
              </List.Item>
            </List>

            <Form.Field error={!!errors.pattern}>
              <label htmlFor="pattern">Pattern</label>
              <Input
                id="pattern"
                placeholder="Pattern"
                value={pattern}
                onChange={this.onPatternChange}
              />
              <small className="helper">
                Used in physical file names.
                English words separated with &lsquo;-&rsquo;
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
              <small className="helper">A short description about this tag</small>
            </Form.Field>
          </Form>
        </Segment>

        <Segment clearing attached="bottom" size="tiny">
          {
            submitted && err
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

export default TagInfoForm;
