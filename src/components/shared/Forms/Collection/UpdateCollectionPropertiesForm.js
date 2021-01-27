import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form } from 'semantic-ui-react';

import { countries } from '../../../../helpers/countries';
import * as shapes from '../../../shapes';
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
    const { start_date: start, end_date: end, film_date: film, tags: tagsUIDs = [] } = properties;

    // convert country to country code
    const country = properties.country ?
      countries.find(x => x.text === properties.country).value :
      '';

    return {
      ...state,
      ...properties,
      type_id: typeID,
      start_date: start ? moment.utc(start) : null,
      end_date: end ? moment.utc(end) : null,
      film_date: film ? moment.utc(film) : null,
      country,
      tagsUIDs: [...tagsUIDs]
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
