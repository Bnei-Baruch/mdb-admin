import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Button, Checkbox, Divider, Flag, Form, Header, Input, Message, Segment } from 'semantic-ui-react';

import {
  COLLECTION_TYPE_OPTIONS,
  COLLECTION_TYPES,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_HOLIDAY,
  CT_PICNIC,
  CT_SPECIAL_LESSON,
  CT_UNITY_DAY,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSON,
  DATE_FORMAT,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  MAJOR_LANGUAGES
} from '../../helpers/consts';
import { countries } from '../../helpers/countries';
import { formatError, isValidPattern } from '../../helpers/utils';
import LanguageSelector from '../shared/LanguageSelector';
import './collections.css';

class NewCollectionForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
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
    const i18n = MAJOR_LANGUAGES.reduce((acc, val) => {
      acc[val] = { name: '' };
      return acc;
    }, {});

    return {
      type_id: null,
      i18n,
      pattern: '',
      active: true,
      start_date: moment().format(DATE_FORMAT),
      end_date: moment().add(1, 'days').format(DATE_FORMAT),
      film_date: moment().format(DATE_FORMAT),
      country: '',
      city: '',
      full_address: '',
      default_language: '',
      submitted: false,
      errors: {},
    };
  }

  getPropertiesFromState = () => {
    const state = this.state;

    // common properties to all types
    const data = {};

    // per type specific properties
    switch (state.type_id) {
    case COLLECTION_TYPES[CT_DAILY_LESSON].value:
    case COLLECTION_TYPES[CT_SPECIAL_LESSON].value:
      data.film_date = state.film_date;
      break;
    case COLLECTION_TYPES[CT_CONGRESS].value:
      data.pattern      = state.pattern;
      data.active       = state.active;
      data.start_date   = state.start_date;
      data.end_date     = state.end_date;
      data.country      = state.country ? countries.find(x => x.value === state.country).text : state.country;
      data.city         = state.city;
      data.full_address = state.full_address;
      break;
    case COLLECTION_TYPES[CT_HOLIDAY].value:
    case COLLECTION_TYPES[CT_PICNIC].value:
    case COLLECTION_TYPES[CT_UNITY_DAY].value:
      data.pattern    = state.pattern;
      data.active     = state.active;
      data.start_date = state.start_date;
      data.end_date   = state.end_date;
      break;
    case COLLECTION_TYPES[CT_VIDEO_PROGRAM].value:
    case COLLECTION_TYPES[CT_VIRTUAL_LESSON].value:
      data.pattern          = state.pattern;
      data.active           = state.active;
      data.default_language = state.default_language;
      break;
    default:
      break;
    }

    return data;
  };

  handleTypeChange = (e, data) =>
    this.setState({ type_id: data.value });

  handleI18nChange = (e, data) => {
    const { id, value } = data;
    const language      = id.substring(0, 2);

    const { errors, i18n } = this.state;
    if (errors.i18n && value.trim() !== '') {
      delete errors.i18n;
    }
    i18n[language].name = value;

    this.setState({ errors, i18n });
  };

  handlePatternChange = (e, data) => {
    const pattern = data.value;

    const errors = this.state.errors;
    if (isValidPattern(pattern)) {
      delete errors.pattern;
    } else {
      errors.pattern = true;
    }

    this.setState({ pattern, errors });
  };

  handleActiveChange = (e, data) =>
    this.setState({ active: data.checked });

  handleDefaultLanguageChange = (e, data) =>
    this.setState({ default_language: data.value });

  handleStartDateChange = (date) => {
    const errors = this.state.errors;
    delete errors.start_date;
    this.setState({ start_date: date, errors });
  };

  handleEndDateChange = (date) => {
    const errors = this.state.errors;
    delete errors.end_date;
    this.setState({ end_date: date, errors });
  };

  handleFilmDateChange = (date) => {
    const errors = this.state.errors;
    delete errors.film_date;
    this.setState({ film_date: date, errors });
  };

  handleCountryChange = (e, data) => {
    const errors = this.state.errors;
    delete errors.country;
    this.setState({ country: data.value, errors });
  };

  handleCityChange = (e, data) => {
    const errors = this.state.errors;
    delete errors.city;
    this.setState({ city: data.value, errors });
  };

  handleFullAddressChange = (e, data) => {
    const errors = this.state.errors;
    delete errors.full_address;
    this.setState({ full_address: data.value, errors });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { i18n, type_id: typeID } = this.state;

    const cleanI18n = MAJOR_LANGUAGES.reduce((acc, val) => {
      if (i18n[val].name.trim() !== '') {
        acc[val] = { ...i18n[val], language: val };
      }
      return acc;
    }, {});

    const properties      = this.getPropertiesFromState();
    const cleanProperties = Object.entries(properties).reduce((acc, val) => {
      const [k, v] = val;
      if (typeof v === 'string') {
        if (v.trim() !== '') {
          acc[k] = v.trim();
        }
      } else if (v !== null && typeof v !== 'undefined') {
        acc[k] = v;
      }
      return acc;
    }, {});

    this.props.create(typeID, cleanProperties, cleanI18n);
    this.setState({ submitted: true });
  };

  isValid = () => {
    // validate required fields (most of them are...)
    const required = this.getPropertiesFromState();
    delete required.active;
    delete required.default_language;

    const errors = Object.entries(required).reduce((acc, val) => {
      const [k, v] = val;
      if (!v || v.trim() === '') {
        acc[k] = true;
      }
      return acc;
    }, {});

    // validate at least one valid translation
    const i18n = this.state.i18n;
    if (MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      errors.i18n = true;
    }

    // do we have any error ?
    if (Object.values(errors).some(x => x)) {
      this.setState({ errors });
      return false;
    }

    return true;
  };

  renderPatternField = () => {
    const { pattern, errors } = this.state;

    return (
      <Form.Field required error={errors.pattern} width={10}>
        <label htmlFor="pattern">Pattern</label>
        <Input
          id="pattern"
          placeholder="Pattern"
          value={pattern}
          onChange={this.handlePatternChange}
        />
        <small className="helper">
          Used in physical file names.
          English words separated with &lsquo;-&rsquo;
        </small>
      </Form.Field>
    );
  };

  renderActiveField = () => {
    const active = this.state.active;
    return (
      <Form.Field>
        <label htmlFor="active">Active</label>
        <Checkbox
          toggle
          id="active"
          checked={active}
          onChange={this.handleActiveChange}
        />
      </Form.Field>
    );
  };

  renderDefaultLanguageField = () => {
    const defaultLanguage = this.state.default_language;
    return (
      <Form.Field width={4}>
        <label htmlFor="default_language">Default Language</label>
        <LanguageSelector
          selection
          id="default_language"
          value={defaultLanguage}
          onChange={this.handleDefaultLanguageChange}
        />
      </Form.Field>
    );
  };

  renderFilmDateField = () => {
    const { film_date: filmDate, errors } = this.state;

    const dayPickerProps = {
      firstDayOfWeek: 0,
    };

    return (
      <Form.Field required error={!!errors.film_date} width={6}>
        <label htmlFor="film_date">Film Date</label>
        <DayPickerInput
          id="film_date"
          placeholder={DATE_FORMAT}
          format={DATE_FORMAT}
          value={moment(filmDate).format(DATE_FORMAT)}
          onDayChange={this.handleFilmDateChange}
          dayPickerProps={dayPickerProps}
          style={{ width: '100%', zIndex: 1000 }}
        />
      </Form.Field>
    );
  };

  renderDateRangeFields = () => {
    const { start_date, end_date, errors } = this.state;

    const dayPickerStartProps = {
      firstDayOfWeek: 0,
      disabledDays: {
        after: moment(end_date).toDate(),
      },
    };

    const dayPickerEndProps = {
      firstDayOfWeek: 0,
      disabledDays: {
        before: moment(start_date).toDate(),
      },
    };

    return (
      <Form.Group widths="equal">
        <Form.Field required error={!!errors.start_date}>
          <label htmlFor="start_date">Start Date</label>
          <DayPickerInput
            id="start_date"
            placeholder={DATE_FORMAT}
            format={DATE_FORMAT}
            value={moment(start_date).format(DATE_FORMAT)}
            onDayChange={this.handleStartDateChange}
            dayPickerProps={dayPickerStartProps}
            style={{ width: '100%', zIndex: 1000 }}
          />
        </Form.Field>
        <Form.Field required error={!!errors.end_date}>
          <label htmlFor="end_date">End Date</label>
          <DayPickerInput
            id="end_date"
            placeholder={DATE_FORMAT}
            format={DATE_FORMAT}
            value={moment(end_date).format(DATE_FORMAT)}
            onDayChange={this.handleEndDateChange}
            dayPickerProps={dayPickerEndProps}
            style={{ width: '100%', zIndex: 1000 }}
          />
        </Form.Field>
      </Form.Group>
    );
  };

  renderLocationFields = () => {
    const { city, full_address: fullAddress, errors } = this.state;

    return (
      <div>
        <Form.Group widths="equal">
          <Form.Dropdown
            fluid
            search
            selection
            required
            label="Country"
            placeholder="Country"
            options={countries}
            error={errors.country}
            onChange={this.handleCountryChange}
          />
          <Form.Field required error={errors.city}>
            <label htmlFor="city">City</label>
            <Input
              id="city"
              placeholder="City"
              value={city}
              onChange={this.handleCityChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field required error={errors.full_address}>
          <label htmlFor="full_address">Full Address</label>
          <Input
            id="full_address"
            placeholder="Full Address"
            value={fullAddress}
            onChange={this.handleFullAddressChange}
          />
        </Form.Field>
      </div>
    );
  };

  renderDailyLesson = () =>
    (this.renderFilmDateField());

  renderVideoProgram = () => (
    <div>
      {this.renderPatternField()}
      {this.renderActiveField()}
      {this.renderDefaultLanguageField()}
    </div>
  );

  renderCongress = () => (
    <div>
      {this.renderPatternField()}
      {this.renderActiveField()}
      {this.renderDateRangeFields()}
      {this.renderLocationFields()}
    </div>
  );

  renderPicnic = () => (
    <div>
      {this.renderPatternField()}
      {this.renderActiveField()}
      {this.renderDateRangeFields()}
    </div>
  );

  renderByType = () => {
    const { type_id: typeID, i18n, errors } = this.state;
    if (!typeID) {
      return null;
    }

    let properties = null;
    switch (typeID) {
    case COLLECTION_TYPES[CT_DAILY_LESSON].value:
    case COLLECTION_TYPES[CT_SPECIAL_LESSON].value:
      properties = this.renderDailyLesson();
      break;
    case COLLECTION_TYPES[CT_CONGRESS].value:
      properties = this.renderCongress();
      break;
    case COLLECTION_TYPES[CT_HOLIDAY].value:
    case COLLECTION_TYPES[CT_PICNIC].value:
    case COLLECTION_TYPES[CT_UNITY_DAY].value:
      properties = this.renderPicnic();
      break;
    case COLLECTION_TYPES[CT_VIDEO_PROGRAM].value:
    case COLLECTION_TYPES[CT_VIRTUAL_LESSON].value:
      properties = this.renderVideoProgram();
      break;
    default:
      break;
    }

    return (
      <div>
        <Divider horizontal section>Properties</Divider>

        {properties}

        <Divider horizontal section>Translations</Divider>

        <Form.Group widths="equal">
          <Form.Field>
            <label htmlFor="he.name"><Flag name="il" />Hebrew</label>
            <Input
              id="he.name"
              placeholder="Name in Hebrew"
              value={i18n[LANG_HEBREW].name}
              onChange={this.handleI18nChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="ru.name"><Flag name="ru" />Russian</label>
            <Input
              id="ru.name"
              placeholder="Name in Russian"
              value={i18n[LANG_RUSSIAN].name}
              onChange={this.handleI18nChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label htmlFor="en.name"><Flag name="us" />English</label>
            <Input
              id="en.name"
              placeholder="Name in English"
              value={i18n[LANG_ENGLISH].name}
              onChange={this.handleI18nChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="es.name"><Flag name="es" />Spanish</label>
            <Input
              id="es.name"
              placeholder="Name in Spanish"
              value={i18n[LANG_SPANISH].name}
              onChange={this.handleI18nChange}
            />
          </Form.Field>
        </Form.Group>
        {
          errors.i18n ?
            <Message negative content="At least one translation is required" /> :
            null
        }
      </div>
    );
  };

  render() {
    const { wip, err }  = this.props;
    const { submitted } = this.state;

    return (
      <Segment.Group>
        <Segment basic>
          <Form onSubmit={this.handleSubmit}>
            <Form.Dropdown
              search
              selection
              inline
              label="Content Type"
              placeholder="Content Type"
              options={COLLECTION_TYPE_OPTIONS}
              onChange={this.handleTypeChange}
            />
            {this.renderByType()}
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

export default NewCollectionForm;
