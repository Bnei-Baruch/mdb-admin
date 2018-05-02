import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, Form, Message } from 'semantic-ui-react';

import { COLLECTION_TYPE_OPTIONS, MAJOR_LANGUAGES, REQUIRED_LANGUAGES } from '../../../../helpers/consts';
import { MajorLangsI18nField } from '../../../shared/Fields';
import BaseCollectionForm from './BaseCollectionForm';

class CreateCollectionForm extends BaseCollectionForm {
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
      holiday_tag: '',
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

  getI18nErrors() {
    const errors = {};
    // validate at least one valid translation
    const i18n   = this.state.i18n;
    if (REQUIRED_LANGUAGES.some(x => i18n[x].name.trim() === '')) {
      errors.i18n = true;
    }

    return errors;
  }

  doSubmit(typeID, properties, i18n) {
    this.props.create(typeID, properties, i18n);
  }

  renderContentTypeField = () => (
    <Form.Dropdown
      search
      selection
      inline
      label="Content Type"
      placeholder="Content Type"
      options={COLLECTION_TYPE_OPTIONS}
      onChange={this.handleTypeChange}
    />
  );

  renderForm() {
    const { type_id: typeID, i18n, errors } = this.state;

    if (typeID) {
      return (
        <Form onSubmit={this.handleSubmit}>
          {this.renderContentTypeField()}

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

    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderContentTypeField()}
      </Form>
    );
  }
}

export default CreateCollectionForm;
