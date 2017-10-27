import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, Form, Message, Segment, Button, Header } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { COLLECTION_TYPE_OPTIONS, MAJOR_LANGUAGES, DATE_FORMAT } from '../../../helpers/consts';
import { MajorLangsI18nField, FilmDateField } from '../../shared/Fields';

class CreateCUForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    wip: PropTypes.bool.isRequired,
    err: PropTypes.bool,
  };

  static defaultProps = {
    wip: false,
    err: null,
  };

  state = {
    type_id: COLLECTION_TYPE_OPTIONS.CT_DAILY_LESSON,
    i18n: MAJOR_LANGUAGES.reduce((acc, val) => {
      acc[val] = { name: '' };
      return acc;
    }, {}),
    capture_date: moment(),
    film_date: moment(),
    submitted: false,
  };

  handleI18nChange = (i18n) => {
    const { errors } = this.state;
    if (!MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      delete errors.i18n;
    }
    this.setState({ errors, i18n });
  };

  handleTypeChange = (e, data) =>
    this.setState({ type_id: data.value });

  handleFilmDateChange = (date) => {
    const errors = this.state.errors;
    delete errors.film_date;
    this.setState({ film_date: date, errors });
  };
  handleCaptureDate    = (date) => {
    const errors = this.state.errors;
    delete errors.capture_date;
    this.setState({ capture_date: date, errors });
  };

  doSubmit(type_id, properties, i18n) {
    if (!this.validate()) {
      return;
    }
    this.props.create(type_id, properties, i18n);
    this.setState({ submitted: true });
  }

  validate() {
    const { errors, i18n } = this.state;
    if (MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      errors.i18n = true;
    }

    return errors;
  }

  fieldsByTypeId() {
    const { type_id, i18n, errors, capture_date, film_date } = this.state;
    if (!type_id) {
      return;
    }
    return (
      <div>

        <Divider horizontal section>Properties</Divider>
        <Form.Group widths="equal">

          <Form.Field
            required
            error={errors.capture_date}>
            <label htmlFor='capture_date'>Capture Date</label>
            <DayPickerInput
              id="capture_date"
              placeholder={DATE_FORMAT}
              format={DATE_FORMAT}
              value={capture_date.format(DATE_FORMAT)}
              onDayChange={this.handleCaptureDate}
            />
          </Form.Field>
          <FilmDateField
            value={film_date}
            err={this.state.errors.film_date}
            onChange={this.handleFilmDateChange}
            required
          />
        </Form.Group>

        <Divider horizontal section>Translations</Divider>
        <MajorLangsI18nField
          i18n={i18n}
          err={errors.i18n}
          onChange={this.handleI18nChange}
        />
        {
          errors.i18n ?
            <Message negative content="At least one translation is required" /> :
            null
        }
      </div>);
  }

  render() {

    return (
      <Form onSubmit={this.handleSubmit}>
        <Segment.Group>
          <Segment basic>
            <Form.Dropdown
              search
              selection
              inline
              label="Content Type"
              placeholder="Content Type"
              options={COLLECTION_TYPE_OPTIONS}
              onChange={this.handleTypeChange}
            />
            {this.fieldsByTypeId()}
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
      </Form>
    );
  }
}

export default CreateCUForm;