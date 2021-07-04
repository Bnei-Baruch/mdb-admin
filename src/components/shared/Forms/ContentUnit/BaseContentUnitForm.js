import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Form, Header, Input, Segment, Table } from 'semantic-ui-react';

import {
  CONTENT_UNIT_TYPES,
  CT_ARTICLE,
  CT_BLOG_POST,
  CT_CHILDREN_LESSON,
  CT_CLIP,
  CT_EVENT_PART,
  CT_FRIENDS_GATHERING,
  CT_FULL_LESSON,
  CT_KITEI_MAKOR,
  CT_LECTURE,
  CT_LESSON_PART,
  CT_MEAL,
  CT_PUBLICATION,
  CT_RESEARCH_MATERIAL,
  CT_KTAIM_NIVCHARIM,
  CT_TRAINING,
  CT_UNKNOWN,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  CT_LIKUTIM, RTL_LANGUAGES,
} from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import { FilmDateField, LanguageField } from '../../Fields';
import { cleanProperties } from '../utils';

class BaseContentUnitForm extends Component {
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
    case CONTENT_UNIT_TYPES[CT_LESSON_PART].value:
    case CONTENT_UNIT_TYPES[CT_LECTURE].value:
    case CONTENT_UNIT_TYPES[CT_CHILDREN_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_WOMEN_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_VIRTUAL_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_FRIENDS_GATHERING].value:
    case CONTENT_UNIT_TYPES[CT_MEAL].value:
    case CONTENT_UNIT_TYPES[CT_VIDEO_PROGRAM_CHAPTER].value:
    case CONTENT_UNIT_TYPES[CT_FULL_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_ARTICLE].value:
    case CONTENT_UNIT_TYPES[CT_UNKNOWN].value:
    case CONTENT_UNIT_TYPES[CT_EVENT_PART].value:
    case CONTENT_UNIT_TYPES[CT_CLIP].value:
    case CONTENT_UNIT_TYPES[CT_TRAINING].value:
    case CONTENT_UNIT_TYPES[CT_KITEI_MAKOR].value:
    case CONTENT_UNIT_TYPES[CT_PUBLICATION].value:
    case CONTENT_UNIT_TYPES[CT_RESEARCH_MATERIAL].value:
    case CONTENT_UNIT_TYPES[CT_KTAIM_NIVCHARIM].value:
    case CONTENT_UNIT_TYPES[CT_BLOG_POST].value:
      data.film_date         = state.film_date;
      data.original_language = state.original_language;
      break;
    case CONTENT_UNIT_TYPES[CT_LIKUTIM].value:
      data.film_date         = state.film_date;
      data.original_language = state.original_language;
      data.pattern           = state.pattern;
      break;
    default:
      break;
    }

    return data;
  };

  handleFilmDateChange = (date) => {
    const { errors } = this.state;
    delete errors.film_date;
    this.setState({ film_date: date, errors });
  };

  handleOriginalLanguageChange = (e, data) => {
    const { errors } = this.state;
    delete errors.original_language;
    this.setState({ original_language: data.value });
  };

  handlePatternChange = (e, data) => {
    const { errors } = this.state;
    delete errors.pattern;
    this.setState({ pattern: data.value });
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
    this.doSubmit(this.state.type_id, properties, i18n);
    this.setState({ submitted: true });
  };

  // eslint-disable-next-line class-methods-use-this
  doSubmit(typeID, properties, i18n) {
    throw new Error('Not Implemented');
  }

  validate() {
    // validate required fields (most of them are...)
    const required      = this.getPropertiesFromState();
    const patternRegexp = /^[a-z-]+$/;

    return Object.entries(required).reduce((acc, val) => {
      const [k, v] = val;
      if (k === 'pattern') {
        acc[k] = !patternRegexp.test(v);
        return acc;
      }
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

  renderOriginalLanguageField = () => (
    <LanguageField
      name="original_language"
      value={this.state.original_language}
      err={this.state.errors.original_language}
      onChange={this.handleOriginalLanguageChange}
    />
  );

  renderFilmDateField = () => (
    <FilmDateField
      value={moment(this.state.film_date)}
      err={this.state.errors.film_date}
      onChange={this.handleFilmDateChange}
      required
    />
  );

  renderPatternField = () => (
    <Form.Field error={this.state.errors.pattern} required>
      <label htmlFor="pattern">Pattern</label>
      <Input
        fluid
        id="pattern"
        name="pattern"
        value={this.state.pattern}
        onChange={this.handlePatternChange}
      />
    </Form.Field>
  );

  renderLessonPart = () => (
    <div>
      {this.renderAssociateCollection()}
      {this.renderFilmDateField()}
      {this.renderOriginalLanguageField()}
    </div>
  );

  renderLikutim = () => (
    <div>
      {this.renderAssociateCollection()}
      {this.renderFilmDateField()}
      {this.renderPatternField()}
      {this.renderOriginalLanguageField()}
    </div>
  );

  renderAssociateCollection = () => {
    return null;
  };

  renderProperties = () => {
    switch (this.state.type_id) {
    case CONTENT_UNIT_TYPES[CT_LESSON_PART].value:
    case CONTENT_UNIT_TYPES[CT_LECTURE].value:
    case CONTENT_UNIT_TYPES[CT_CHILDREN_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_WOMEN_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_VIRTUAL_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_FRIENDS_GATHERING].value:
    case CONTENT_UNIT_TYPES[CT_MEAL].value:
    case CONTENT_UNIT_TYPES[CT_VIDEO_PROGRAM_CHAPTER].value:
    case CONTENT_UNIT_TYPES[CT_FULL_LESSON].value:
    case CONTENT_UNIT_TYPES[CT_ARTICLE].value:
    case CONTENT_UNIT_TYPES[CT_UNKNOWN].value:
    case CONTENT_UNIT_TYPES[CT_EVENT_PART].value:
    case CONTENT_UNIT_TYPES[CT_TRAINING].value:
    case CONTENT_UNIT_TYPES[CT_KITEI_MAKOR].value:
    case CONTENT_UNIT_TYPES[CT_PUBLICATION].value:
    case CONTENT_UNIT_TYPES[CT_RESEARCH_MATERIAL].value:
    case CONTENT_UNIT_TYPES[CT_KTAIM_NIVCHARIM].value:
    case CONTENT_UNIT_TYPES[CT_BLOG_POST].value:
      return this.renderLessonPart();
    case CONTENT_UNIT_TYPES[CT_LIKUTIM].value:
    case CONTENT_UNIT_TYPES[CT_CLIP].value:
      return this.renderLikutim();
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

export default BaseContentUnitForm;
