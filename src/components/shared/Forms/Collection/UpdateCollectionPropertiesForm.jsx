import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '../../../ui';

import { countries } from '../../../../helpers/countries';
import * as shapes from '../../../shapes';
import BaseCollectionForm from './BaseCollectionForm';
import { toDateString } from '../../../../helpers/date';

class UpdateCollectionPropertiesForm extends BaseCollectionForm {
  static propTypes = {
    update: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  getInitialState() {
    const state                           = super.getInitialState();
    const { type_id: typeID, properties } = this.props.collection;

    // normalize date fields to 'yyyy-MM-dd' strings
    const { start_date: start, end_date: end, film_date: film, tags: tagsUIDs = [], number } = properties;

    // convert country to country code
    const country = properties.country ?
      countries.find(x => x.text === properties.country).value :
      '';

    return {
      ...state,
      ...properties,
      type_id: typeID,
      start_date: toDateString(start),
      end_date: toDateString(end),
      film_date: toDateString(film),
      country,
      tagsUIDs: [...tagsUIDs],
      number
    };
  }

  doSubmit(typeID, properties) {
    this.props.update(this.props.collection.id, properties);
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderProperties()}
      </Form>
    );
  }
}

export default UpdateCollectionPropertiesForm;
