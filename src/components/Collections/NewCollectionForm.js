import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Divider, Form, Header, Message, Segment } from 'semantic-ui-react';

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
  MAJOR_LANGUAGES
} from '../../helpers/consts';
import { countries } from '../../helpers/countries';
import { formatError, isValidPattern } from '../../helpers/utils';
import {
  DateRangeField,
  FilenamePatternField,
  FilmDateField,
  LanguageField,
  LocationField,
  MajorLangsI18nField,
  ToggleField
} from '../shared/Fields';
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
      start_date: moment(),
      end_date: moment().add(1, 'days'),
      film_date: moment(),
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

  handleI18nChange = (i18n) => {
    const { errors } = this.state;
    if (!MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      delete errors.i18n;
    }
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

  handleDateRangeChange = (range) => {
    const { start, end } = range;
    const errors         = this.state.errors;
    if (start) {
      delete errors.start_date;
    }
    if (end) {
      delete errors.end_date;
    }
    this.setState({ start_date: start, end_date: end, errors });
  };

  handleFilmDateChange = (date) => {
    const errors = this.state.errors;
    delete errors.film_date;
    this.setState({ film_date: date, errors });
  };

  handleLocationChange = (location) => {
    const { country, city, fullAddress } = location;
    const errors                         = this.state.errors;
    if (country) {
      delete errors.country;
    }
    if (city) {
      delete errors.city;
    }
    if (fullAddress) {
      delete errors.full_address;
    }
    this.setState({ country, city, full_address: fullAddress, errors });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { i18n, type_id: typeID } = this.state;

    // clean i18n
    const cleanI18n = MAJOR_LANGUAGES.reduce((acc, val) => {
      if (i18n[val].name.trim() !== '') {
        acc[val] = { ...i18n[val], language: val };
      }
      return acc;
    }, {});

    // clean properties
    const properties      = this.getPropertiesFromState();
    const cleanProperties = Object.entries(properties).reduce((acc, val) => {
      const [k, v] = val;
      if (typeof v === 'string') {
        if (v.trim() !== '') {
          acc[k] = v.trim();
        }
      } else if (moment.isMoment(v)) {
        acc[k] = v.format(DATE_FORMAT);
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
      if (!v || (typeof v === 'string' && v.trim() === '')) {
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

  renderPatternField = () => (
    <FilenamePatternField
      required
      value={this.state.pattern}
      err={this.state.errors.pattern}
      onChange={this.handlePatternChange}
    />
  );

  renderActiveField = () => (
    <ToggleField
      name="active"
      value={this.state.active}
      onChange={this.handleActiveChange}
    />
  );

  renderDefaultLanguageField = () => (
    <LanguageField
      name="default_language"
      value={this.state.default_language}
      onChange={this.handleDefaultLanguageChange}
      width={4}
    />
  );

  renderFilmDateField = () => (
    <FilmDateField
      value={this.state.film_date}
      err={this.state.errors.film_date}
      onChange={this.handleFilmDateChange}
      required
      width={6}
    />
  );

  renderDateRangeFields = () => {
    const { start_date: start, end_date: end, errors } = this.state;
    const err                                          = {
      start: errors.start_date,
      end: errors.end_date
    };

    return (
      <DateRangeField
        start={start}
        end={end}
        err={err}
        onChange={this.handleDateRangeChange}
      />
    );
  };

  renderLocationFields = () => {
    const { country, city, full_address: fullAddress, errors } = this.state;
    const err                                                  = {
      country: errors.country,
      city: errors.city,
      fullAddress: errors.full_address,
    };

    return (
      <LocationField
        country={country}
        city={city}
        fullAddress={fullAddress}
        err={err}
        onChange={this.handleLocationChange}
      />
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
