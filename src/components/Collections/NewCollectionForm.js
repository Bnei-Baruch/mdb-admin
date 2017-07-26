import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromPairs, trim } from 'lodash';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Button, Checkbox, Divider, Dropdown, Flag, Form, Header, Input, Segment, Select } from 'semantic-ui-react';

import {
  COLLECTION_TYPE_OPTIONS,
  COLLECTION_TYPES,
  CT_CONGRESS,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSON,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANGUAGES,
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
    const i18nArr = MAJOR_LANGUAGES.map(l => ([l, { language: l, name: '', description: '' }]));

    return {
      type_id: COLLECTION_TYPES[CT_CONGRESS].value,
      isActive: false,
      pattern: '',
      i18n: fromPairs(i18nArr),
      submitted: false,
      errors: {},
      start_day: moment().format('YYYY-MM-DD'),
      end_day: moment().add(1, 'days').format('YYYY-MM-DD'),
      country: '',
      city: '',
      full_address: '',
      default_language: LANG_HEBREW,
    };
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

  onI18nChange = (e, { value }, language) => {
    const { errors, i18n } = this.state;
    if (errors.i18n && value.trim() !== '') {
      delete errors.i18n;
    }
    i18n[language].name = value;

    this.setState({ errors, i18n });
  };

  onCountryChange = (e, { value }) => {
    const errors = this.state.errors;
    delete errors.country;

    this.setState({ country: value, errors });
  };

  handleTypeChange = (e, data) => this.setState({ type_id: data.value });

  toggleActive = () => this.setState({ isActive: !this.state.isActive });

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }

    const { i18n, type_id: typeID } = this.state;
    const properties                = this.prepareDataByTypeId();
    this.props.create(typeID, properties, i18n);

    this.setState({ submitted: true });
  };

  prepareDataByTypeId = () => {
    const state = this.state;

    // common properties to all types
    const data = {
      pattern: state.pattern,
    };

    // per type specific properties
    switch (state.type_id) {
    case COLLECTION_TYPES[CT_CONGRESS].value:
      data.start_date   = state.start_day;
      data.end_date     = state.end_day;
      data.country      = state.country;
      data.city         = state.city;
      data.full_address = state.full_address;
      break;
    case COLLECTION_TYPES[CT_VIDEO_PROGRAM].value:
    case COLLECTION_TYPES[CT_VIRTUAL_LESSON].value:
      data.default_language = state.default_language;
      break;
    default:
      break;
    }

    return data;
  };

  isValid = () => {
    const { type_id, pattern, start_day, end_day, country, city, errors } = this.state;

    if (Object.keys(errors).filter(key => !errors[key]).length !== 0) {
      return false;
    }

    let requiredFields = { pattern };
    if (type_id === COLLECTION_TYPES[CT_CONGRESS].value) {
      requiredFields = Object.assign(requiredFields, { start_day, end_day, country });
    }
    const _errors = Object.keys(requiredFields)
      .filter(key => !trim(requiredFields[key]))
      .map(key => [key, true]);

    if (_errors.length > 0) {
      this.setState({ errors: fromPairs(_errors) });
      return false;
    }
    return true;
  };

  renderCongressFields = () => {
    const { city, start_day, end_day, address, errors } = this.state;

    const dayPickerStartProps = {
      disabledDays: {
        after: moment(end_day).toDate(),
      },
    };

    const dayPickerEndProps = {
      disabledDays: {
        before: moment(start_day).toDate(),
      },
    };

    return (
      <div>
        <Form.Group widths="equal">
          <Form.Field error={!!errors.start_day}>
            <label htmlFor="start_day">Start day*</label>
            <DayPickerInput
              style={{ width: '100%', zIndex: 1000 }}
              placeholder="YYYY-MM-DD"
              format="YYYY-MM-DD"
              value={moment(start_day).format('YYYY-MM-DD')}
              onDayChange={(val) => {
                delete errors.start_day;
                this.setState({ start_day: val, errors });
              }}
              dayPickerProps={dayPickerStartProps}
            />
          </Form.Field>
          <Form.Field error={!!errors.end_day}>
            <label htmlFor="end_day">End day*</label>
            <DayPickerInput
              style={{ width: '100%', zIndex: 1000 }}
              placeholder="YYYY-MM-DD"
              format="YYYY-MM-DD"
              value={moment(end_day).format('YYYY-MM-DD')}
              onDayChange={(val) => {
                delete errors.end_day;
                this.setState({ end_day: val });
              }}
              dayPickerProps={dayPickerEndProps}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field error={!!errors.country}>
            <label htmlFor="country">Country*</label>
            <Dropdown
              fluid
              search
              selection
              placeholder="Select Country"
              options={countries}
              onChange={this.onCountryChange}
            />
          </Form.Field>
          <Form.Field error={!!errors.city}>
            <label htmlFor="city">City</label>
            <Input
              id="city"
              placeholder="City"
              value={city}
              onChange={(e, { value }) => this.setState({ city: value })}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label htmlFor="end_day">Address</label>
          <Input
            id="address"
            placeholder="Address"
            value={address}
            onChange={(e, { value }) => this.setState({ address: value })}
          />
        </Form.Field>
      </div>
    );
  };

  renderDefaultLanguage = () => {
    const defaultLanguage = this.state.default_language;
    return (
      <div>
        <Flag name={LANGUAGES[defaultLanguage].flag} />
        {LANGUAGES[defaultLanguage].text}
        <LanguageSelector
          text="Select default language"
          exclude={[defaultLanguage]}
          onSelect={l => this.setState({ default_language: l })}
        />
      </div>
    );
  };

  renderByType = () => {
    switch (this.state.type_id) {
    case COLLECTION_TYPES[CT_CONGRESS].value:
      return this.renderCongressFields();
    case COLLECTION_TYPES[CT_VIDEO_PROGRAM].value:
    case COLLECTION_TYPES[CT_VIRTUAL_LESSON].value:
      return this.renderDefaultLanguage();
    default:
      return null;
    }
  };

  render() {
    const { wip, err }                                   = this.props;
    const { submitted, errors, isActive, pattern, i18n } = this.state;

    return (
      <Segment.Group>
        <Segment basic>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Field widths={7}>
                <label htmlFor="type_id">Collection type</label>
                <Select
                  id="type_id"
                  placeholder="Select collection type"
                  options={COLLECTION_TYPE_OPTIONS}
                  onChange={this.handleTypeChange}
                />
              </Form.Field>
              <Form.Field widths={7} error={!!errors.pattern}>
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
              <Form.Field widths={2} error={!!errors.sctive}>
                <label htmlFor="active">active</label>
                <Checkbox id="active" checked={isActive} onChange={this.toggleActive} />
              </Form.Field>
            </Form.Group>

            <Divider horizontal section>Translations</Divider>

            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="he.name"><Flag name="il" />Hebrew</label>
                <Input
                  id="he.name"
                  placeholder="Label in Hebrew"
                  value={i18n[LANG_HEBREW].name}
                  onChange={(e, x) => this.onI18nChange(e, x, LANG_HEBREW)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="ru.name"><Flag name="ru" />Russian</label>
                <Input
                  id="ru.name"
                  placeholder="Label in Russian"
                  value={i18n[LANG_RUSSIAN].name}
                  onChange={(e, x) => this.onI18nChange(e, x, LANG_RUSSIAN)}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="en.name"><Flag name="us" />English</label>
                <Input
                  id="en.name"
                  placeholder="Label in English"
                  value={i18n[LANG_ENGLISH].name}
                  onChange={(e, x) => this.onI18nChange(e, x, LANG_ENGLISH)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="es.name"><Flag name="es" />Spanish</label>
                <Input
                  id="es.name"
                  placeholder="Label in Spanish"
                  value={i18n[LANG_SPANISH].name}
                  onChange={(e, x) => this.onI18nChange(e, x, LANG_SPANISH)}
                />
              </Form.Field>
            </Form.Group>
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
