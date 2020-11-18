import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Header, Segment } from 'semantic-ui-react';

import {
  COLLECTION_TYPES,
  CT_ARTICLES,
  CT_CHILDREN_LESSONS,
  CT_CLIPS,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_HOLIDAY,
  CT_LECTURE_SERIES,
  CT_LESSONS_SERIES,
  CT_PICNIC,
  CT_SPECIAL_LESSON,
  CT_UNITY_DAY,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSONS,
} from '../../../../helpers/consts';
import { countries } from '../../../../helpers/countries';
import { formatError, isValidPattern } from '../../../../helpers/utils';
import { cleanProperties } from '../utils';
import {
  DateRangeField,
  FilenamePatternField,
  FilmDateField,
  GenresField,
  HolidayField,
  LanguageField,
  LocationField,
  SourceField,
  ToggleField,
} from '../../Fields';
import './collections.css';

class BaseCollectionForm extends Component {
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
    const { state } = this;

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
      data.holiday_tag = state.holiday_tag;
      data.start_date  = state.start_date;
      data.end_date    = state.end_date;
      break;
    case COLLECTION_TYPES[CT_PICNIC].value:
    case COLLECTION_TYPES[CT_UNITY_DAY].value:
      data.pattern    = state.pattern;
      data.active     = state.active;
      data.start_date = state.start_date;
      data.end_date   = state.end_date;
      break;
    case COLLECTION_TYPES[CT_VIDEO_PROGRAM].value:
      data.pattern          = state.pattern;
      data.active           = state.active;
      data.default_language = state.default_language;
      data.genres           = state.genres;
      break;
    case COLLECTION_TYPES[CT_LECTURE_SERIES].value:
    case COLLECTION_TYPES[CT_CHILDREN_LESSONS].value:
    case COLLECTION_TYPES[CT_WOMEN_LESSONS].value:
    case COLLECTION_TYPES[CT_VIRTUAL_LESSONS].value:
    case COLLECTION_TYPES[CT_CLIPS].value:
      data.pattern          = state.pattern;
      data.active           = state.active;
      data.default_language = state.default_language;
      break;
    case COLLECTION_TYPES[CT_ARTICLES].value:
      data.pattern = state.pattern;
      break;
    case COLLECTION_TYPES[CT_LESSONS_SERIES].value:
      data.source     = state.source;
      data.start_date = state.start_date;
      data.end_date   = state.end_date;
      break;
    default:
      break;
    }

    return data;
  };

  handlePatternChange = (e, data) => {
    const pattern = data.value;

    const { errors } = this.state;
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
    const { errors } = this.state;
    if (start) {
      delete errors.start_date;
    }
    if (end) {
      delete errors.end_date;
    }
    this.setState({ start_date: start, end_date: end, errors });
  };

  handleFilmDateChange = (date) => {
    const { errors } = this.state;
    delete errors.film_date;
    this.setState({ film_date: date, errors });
  };

  handleLocationChange = (location) => {
    const { country, city, fullAddress } = location;
    const { errors } = this.state;
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

  handleHolidayChange = (e, data) => {
    const { errors } = this.state;
    delete errors.holiday_tag;
    this.setState({ holiday_tag: data.value, errors });
  };

  handleSourceChange = (source) => {
    const { errors } = this.state;
    delete errors.source;
    this.setState({ source: source.uid, errors });
  };

  handleGenresChange = (e, data) =>
    this.setState({ genres: data.value });

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
    this.doSubmit(this.state.type_id, properties, i18n);
    this.setState({ submitted: true });
  };

  // eslint-disable-next-line class-methods-use-this
  doSubmit(typeID, properties, i18n) {
    throw new Error('Not Implemented');
  }

  validate() {
    // validate required fields (most of them are...)
    const required = this.getPropertiesFromState();
    delete required.active;

    return Object.entries(required).reduce((acc, val) => {
      const [k, v] = val;
      if (!v || (typeof v === 'string' && v.trim() === '')) {
        acc[k] = true;
      }
      return acc;
    }, this.getI18nErrors());
  }

  getI18nErrors() {
    return {};
  }

  isValid() {
    const errors = this.validate();

    // do we have any error ?
    if (Object.values(errors).some(x => x)) {
      this.setState({ errors });
      return false;
    }

    return true;
  }

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
      value={moment(this.state.film_date)}
      err={this.state.errors.film_date}
      onChange={this.handleFilmDateChange}
      required
      width={6}
    />
  );

  renderGenresField = () => (
    <GenresField
      value={this.state.genres}
      err={this.state.errors.genres}
      onChange={this.handleGenresChange}
      required
      width={6}
    />
  );

  renderDateRangeFields = () => {
    const { start_date: start, end_date: end, errors } = this.state;

    const err = {
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

    const err = {
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

  renderHolidayField = () => (
    <HolidayField
      value={this.state.holiday_tag}
      err={this.state.errors.holiday_tag}
      onChange={this.handleHolidayChange}
      required
      width={6}
    />
  );

  renderSourceField = () => (
    <SourceField
      value={this.state.source}
      err={this.state.errors.source}
      onChange={this.handleSourceChange}
      required
      width={16}
    />
  );

  renderDailyLesson = () =>
    (this.renderFilmDateField());

  renderVideoProgram = () => (
    <div>
      {this.renderPatternField()}
      {this.renderActiveField()}
      {this.renderDefaultLanguageField()}
      {this.renderGenresField()}
    </div>
  );

  renderLesson = () => (
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

  renderHoliday = () => (
    <div>
      {this.renderHolidayField()}
      {this.renderDateRangeFields()}
    </div>
  );

  renderPicnic = () => (
    <div>
      {this.renderPatternField()}
      {this.renderActiveField()}
      {this.renderDateRangeFields()}
    </div>
  );

  renderArticles = () =>
    (this.renderPatternField());

  renderLessonsSeries = () => (
    <div>
      {this.renderSourceField()}
      {this.renderDateRangeFields()}
    </div>
  );

  renderProperties = () => {
    switch (this.state.type_id) {
    case COLLECTION_TYPES[CT_DAILY_LESSON].value:
    case COLLECTION_TYPES[CT_SPECIAL_LESSON].value:
      return this.renderDailyLesson();
    case COLLECTION_TYPES[CT_CONGRESS].value:
      return this.renderCongress();
    case COLLECTION_TYPES[CT_HOLIDAY].value:
      return this.renderHoliday();
    case COLLECTION_TYPES[CT_PICNIC].value:
    case COLLECTION_TYPES[CT_UNITY_DAY].value:
      return this.renderPicnic();
    case COLLECTION_TYPES[CT_VIDEO_PROGRAM].value:
      return this.renderVideoProgram();
    case COLLECTION_TYPES[CT_LECTURE_SERIES].value:
    case COLLECTION_TYPES[CT_CHILDREN_LESSONS].value:
    case COLLECTION_TYPES[CT_WOMEN_LESSONS].value:
    case COLLECTION_TYPES[CT_VIRTUAL_LESSONS].value:
    case COLLECTION_TYPES[CT_CLIPS].value:
      return this.renderLesson();
    case COLLECTION_TYPES[CT_ARTICLES].value:
      return this.renderArticles();
    case COLLECTION_TYPES[CT_LESSONS_SERIES].value:
      return this.renderLessonsSeries();
    default:
      return null;
    }
  };

  // eslint-disable-next-line class-methods-use-this
  renderForm() {
    throw new Error('Not Implemented');
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
          {submitted && err ? (
            <Header
              inverted
              content={formatError(err)}
              color="red"
              icon="warning sign"
              floated="left"
              size="tiny"
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
      </Segment.Group>
    );
  }
}

export default BaseCollectionForm;
