import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Segment, Form, Input } from 'semantic-ui-react';

import { formatError, isValidPattern } from '../../../../helpers/utils';

class BasePersonForm extends Component {
  static propTypes = {
    wip: PropTypes.bool.isRequired,
    err: PropTypes.bool,
  };

  static defaultProps = {
    wip: false,
    err: null,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      submitted: false,
      errors: {},
    };
  }

  // eslint-disable-next-line class-methods-use-this
  cleanI18n() {
    return null;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const i18n = this.cleanI18n();
    this.doSubmit(this.state.pattern, i18n);
    this.setState({ submitted: true });
  };

  // eslint-disable-next-line class-methods-use-this
  doSubmit(pattern, i18n) {
    throw new Error('Not Implemented');
  }

  validate = () => {
    if (!this.state.pattern || !isValidPattern(this.state.pattern)) {
      return { pattern: true };
    }
    return {};
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

  isValid() {
    const errors = this.validate();

    // do we have any error ?
    if (Object.values(errors).some(x => x)) {
      this.setState({ errors });
      return false;
    }

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  renderForm() {
    throw new Error('Not Implemented');
  }

  renderPattern() {
    const { pattern, errors } = this.state;
    return (
      <Form.Field error={!!errors.pattern}>
        <Input
          id="pattern"
          placeholder="Pattern"
          value={pattern || ''}
          onChange={this.onPatternChange}
        />
        <small className="helper">
          Used in physical file names.
          English words separated with &lsquo;-&rsquo;
        </small>
      </Form.Field>
    );
  }

  render() {
    const { wip, err }  = this.props;
    const { submitted } = this.state;

    return (
      <Segment.Group>
        <Segment basic>
          {this.renderForm()}
        </Segment>

        <Segment clearing attached="bottom" size="tiny">
          {submitted && err ?
            <Header
              inverted
              content={formatError(err)}
              color="red"
              icon="warning sign"
              floated="left"
              size="tiny"
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
      </Segment.Group>
    );
  }
}

export default BasePersonForm;