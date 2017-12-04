import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Segment } from 'semantic-ui-react';

import { formatError, isValidPattern } from '../../../../helpers/utils';
import { LanguageField } from '../../Fields/index';
import { cleanProperties } from '../utils';

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

  getPropertiesFromState = () => {
    const { pattern } = this.state;
    return { pattern };
  };

  handleFilmDateChange = (date) => {
    const errors = this.state.errors;
    delete errors.film_date;
    this.setState({ film_date: date, errors });
  };

  handleOriginalLanguageChange = (e, data) => {
    const errors = this.state.errors;
    delete errors.original_language;
    this.setState({ original_language: data.value });
  };

  // eslint-disable-next-line class-methods-use-this
  cleanI18n() {
    return null;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const properties = cleanProperties(this.getPropertiesFromState());
    const i18n       = this.cleanI18n();
    this.doSubmit(properties, i18n);
    this.setState({ submitted: true });
  };

  // eslint-disable-next-line class-methods-use-this
  doSubmit(typeID, properties, i18n) {
    throw new Error('Not Implemented');
  }

  validate() {
    // validate required fields (most of them are...)
    const required = this.getPropertiesFromState();

    return Object.entries(required).reduce((acc, val) => {
      const [k, v] = val;
      if (!v || (typeof v === 'string' && v.trim() === '')) {
        acc[k] = true;
      }
      return acc;
    }, {});
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

  isValid() {
    const errors = this.validate();

    if (!isValidPattern(pattern)) {
      errors.pattern = true;
      return false;
    }
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