import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Input, List, Menu, Segment } from 'semantic-ui-react';

import { EMPTY_OBJECT } from '../../../../helpers/consts';
import { formatError, isValidPattern } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';

class PersonInfoForm extends Component {

  static propTypes = {
    updateInfo: PropTypes.func.isRequired,
    wipDetail: PropTypes.bool,
    errDetail: PropTypes.object,
    person: shapes.Person,
  };

  static defaultProps = {
    person: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);

    this.state = {
      pattern: props.person.pattern || '',
      submitted: false,
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.person !== nextProps.person) {
      this.setState({
        pattern: nextProps.person.pattern || ''
      });
    }
  }

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
    const { person, updateInfo } = this.props;
    const { pattern, errors }    = this.state;
    if (Object.keys(errors).length > 0) {
      return;
    }
    updateInfo(person.id, pattern);
    this.setState({ submitted: true });
  };

  render() {
    const { person, wipDetail, errDetail } = this.props;
    const { pattern, submitted, errors }   = this.state;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Person Info" size="medium" color="blue" />
          </Menu.Item>
        </Menu>

        <Segment attached>
          <Form onSubmit={this.handleSubmit}>
            <List horizontal floated="right">
              <List.Item><strong>ID:</strong>&nbsp;{person.id}</List.Item>
              <List.Item><strong>UID:</strong>&nbsp;{person.uid}</List.Item>
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
          </Form>
        </Segment>

        <Segment clearing attached="bottom" size="tiny">
          {submitted && errDetail ?
            <Header
              inverted
              content={formatError(errDetail)}
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
            loading={wipDetail}
            disabled={wipDetail}
            onClick={this.handleSubmit}
          />
        </Segment>
      </div>
    );
  }
}

export default PersonInfoForm;
