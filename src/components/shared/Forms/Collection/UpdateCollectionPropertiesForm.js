import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Message } from 'semantic-ui-react';

import { countries } from '../../../../helpers/countries';
import * as shapes from '../../../shapes';
import { MajorLangsI18nField } from '../../../shared/Fields';
import BaseCollectionForm from './BaseCollectionForm';

class UpdateCollectionPropertiesForm extends BaseCollectionForm {
  static propTypes = {
    update: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  getInitialState() {
    const state                           = super.getInitialState();
    const { type_id: typeID, properties } = this.props.collection;

    // convert date fields to moment
    const { start_date: start, end_date: end, film_date: film } = properties;

    // convert country to country code
    const country = properties.country ?
      countries.find(x => x.text === properties.country).value :
      '';

    return {
      ...state,
      ...properties,
      type_id: typeID,
      start_date: start ? moment(start) : null,
      end_date: end ? moment(end) : null,
      film_date: film ? moment(film) : null,
      country
    };
  }

  doSubmit(typeID, properties) {
    this.props.update(this.props.collection.id, properties);
  }

  renderForm() {

    const { i18n, errors } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderProperties()}


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

export default UpdateCollectionPropertiesForm;
