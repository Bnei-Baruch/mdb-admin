import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Form, Message } from 'semantic-ui-react';

import { MAJOR_LANGUAGES } from '../../../../helpers/consts';
import { MajorLangsI18nField } from '../../Fields/index';
import BasePublisherForm from './BasePublisherForm';

class CreatePublisherForm extends BasePublisherForm {
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
      pattern: null,
      i18n,
      updateInfo: PropTypes.func.isRequired,
      original_language: '',
    };
  }

  handleI18nChange = (i18n) => {
    const { errors } = this.state;
    if (!MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      delete errors.i18n;
    }
    this.setState({ errors, i18n });
  };

  cleanI18n() {
    const { i18n } = this.state;
    return MAJOR_LANGUAGES.reduce((acc, val) => {
      if (i18n[val].name.trim() !== '') {
        acc[val] = { ...i18n[val], language: val };
      }
      return acc;
    }, {});
  }

  doSubmit(pattern, i18n) {
    this.props.create(pattern, i18n);
  }

  validate() {
    const errors = super.validate();

    // validate at least one valid translation
    const { i18n } = this.state;
    if (MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      errors.i18n = true;
    }

    return errors;
  }

  renderForm() {
    const { i18n, errors } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>

        <Divider horizontal section>Pattern</Divider>
        {this.renderPattern()}

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

export default CreatePublisherForm;
