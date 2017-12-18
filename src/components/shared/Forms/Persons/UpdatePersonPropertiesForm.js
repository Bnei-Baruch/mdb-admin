import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import BasePersonForm from './BasePersonForm';

class UpdatePersonPropertiesForm extends BasePersonForm {
  static propTypes = {
    update: PropTypes.func.isRequired,
    unit: shapes.Collection,
  };

  getInitialState() {
    const state                           = super.getInitialState();
    const { type_id: typeID, properties } = this.props.unit;

    // convert date fields to moment
    const { film_date: film } = properties;

    return {
      ...state,
      ...properties,
      type_id: typeID,
      film_date: film ? moment(film) : null,
    };
  }

  doSubmit(typeID, properties) {
    this.props.update(this.props.unit.id, properties);
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderProperties()}
      </Form>
    );
  }
}

export default UpdatePersonPropertiesForm;
