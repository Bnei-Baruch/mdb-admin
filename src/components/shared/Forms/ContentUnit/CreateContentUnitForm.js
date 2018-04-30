import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, Form, Message } from 'semantic-ui-react';

import {
  CONTENT_UNIT_TYPE_OPTIONS,
  MAJOR_LANGUAGES,
  CONTENT_UNIT_TYPES,
  CT_LESSON_PART,
} from '../../../../helpers/consts';
import { MajorLangsI18nField } from '../../Fields/index';
import BaseContentUnitForm from './BaseContentUnitForm';

class CreateContentUnitForm extends BaseContentUnitForm {
  static propTypes = {
    create: PropTypes.func.isRequired,
  };

  getInitialState() {
    const state = super.getInitialState();

    const i18n = MAJOR_LANGUAGES.reduce((acc, val) => {
      acc[val] = { name: '' };
      return acc;
    }, {});

    return {
      ...state,
      i18n,
      pattern: '',
      type_id: CONTENT_UNIT_TYPES[CT_LESSON_PART].value,
      film_date: moment(),
      original_language: '',
    };
  }

  handleTypeChange = (e, data) =>
    this.setState({ type_id: data.value });

  handleI18nChange = (i18n) => {
    const { errors } = this.state;
    if (!MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      delete errors.i18n;
    }
    this.setState({ errors, i18n });
  };

  cleanI18n() {
    const i18n = this.state.i18n;
    return MAJOR_LANGUAGES.reduce((acc, val) => {
      if (i18n[val].name.trim() !== '') {
        acc[val] = { ...i18n[val], language: val };
      }
      return acc;
    }, {});
  }

  doSubmit(typeID, properties, i18n) {
    this.props.create(typeID, properties, i18n);
  }

  renderForm() {
    const { i18n, errors, type_id } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>

        <Form.Dropdown
          search
          selection
          inline
          label="Content Type"
          placeholder="Content Type"
          options={CONTENT_UNIT_TYPE_OPTIONS}
          onChange={this.handleTypeChange}
          defaultValue={type_id}
        />

        <Divider horizontal section>Properties</Divider>
        {this.renderProperties()}

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
      </Form>
    );
  }

}

export default CreateContentUnitForm;
