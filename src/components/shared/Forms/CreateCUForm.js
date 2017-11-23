import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, Form, Message, Segment, Menu, Header, Flag } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import LanguageSelector from '../../shared/LanguageSelector';

import { CU_TYPE_OPTIONS, MAJOR_LANGUAGES, DATE_FORMAT, LANGUAGES } from '../../../helpers/consts';
import { MajorLangsI18nField, FilmDateField } from '../../shared/Fields';

class CreateCUForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    wip: PropTypes.bool.isRequired,
    err: PropTypes.bool,
  };

  static defaultProps = {
    wip: false,
    err: null,
  };

  state = {
    type_id: '',
    i18n: MAJOR_LANGUAGES.reduce((acc, val) => {
      acc[val] = { name: '', language: val };
      return acc;
    }, {}),
    capture_date: moment(),
    film_date: moment(),
    submitted: false,
    errors: {},
    original_language: '',
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

  handleSubmit = () => {
    const { create, toggleModal }                    = this.props;
    const { type_id, capture_date, film_date, i18n } = this.state;
    if (!this.validate()) {
      return;
    }
    create({ type_id, i18n, properties: { capture_date, film_date } });
    this.setState({ submitted: true });

    if (!this.props.err) {
      this.setState({ type_id: null });
      toggleModal();
    }
  };

  validate = () => {
    const { errors, i18n, original_language } = this.state;
    if (!original_language || original_language.trim() === '') {
      errors.original_language = true;
      this.setState({ errors });
      return false;
    }
    if (MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      errors.i18n = true;
    }
    if (Object.values(errors).some(x => x)) {
      this.setState({ errors });
      return false;
    }
    return true;
  };

  handleChangeLanguage = (e, { value }) => {
    const errors = this.state.errors;
    delete errors.original_language;
    this.setState({ original_language: value });
  };

  fieldsByTypeId = () => {
    const { type_id, i18n, errors, capture_date, film_date, original_language } = this.state;
    if (!type_id) {
      return;
    }

    let currentLang = 'Please select';

    if (original_language) {
      currentLang = (<div>
        <Flag name={LANGUAGES[original_language].flag} />
        {LANGUAGES[original_language].text}
      </div>);
    }

    return (
      <div>

        <Divider horizontal section>Properties</Divider>
        <Form.Group>

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
            err={errors.film_date}
            onChange={this.handleFilmDateChange}
            required
          />
          <Form.Field
            required
            error={errors.original_language}>
            <label>Original language</label>
            <Menu borderless size="small" compact>
              <Menu.Item>
                {currentLang}
              </Menu.Item>
              <Menu.Menu position="right">
                <LanguageSelector
                  item
                  scrolling
                  text="Change Language"
                  exclude={[original_language]}
                  onChange={this.handleChangeLanguage}
                />
              </Menu.Menu>
            </Menu>
          </Form.Field>
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
  };

  render() {
    const { wip, err, formatError } = this.props;

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
              options={CU_TYPE_OPTIONS}
              onChange={this.handleTypeChange}
            />
            {this.fieldsByTypeId()}
          </Segment>
          <Segment clearing attached="bottom" size="tiny">
            {this.state.submitted && err ?
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
            <Form.Button
              primary
              content="Save"
              size="tiny"
              floated="right"
              loading={wip}
              disabled={wip}
            />
          </Segment>
        </Segment.Group>
      </Form>
    );
  }
}

export default CreateCUForm;