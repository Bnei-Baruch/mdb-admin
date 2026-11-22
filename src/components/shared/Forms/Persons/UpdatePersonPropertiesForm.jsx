import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '../../../ui';

import * as shapes from '../../../shapes';
import BasePersonForm from './BasePersonForm';
import { toDateString } from '../../../../helpers/date';

class UpdatePersonPropertiesForm extends BasePersonForm {
  static propTypes = {
    update: PropTypes.func.isRequired,
    unit: shapes.Collection,
  };

  getInitialState() {
    const state                           = super.getInitialState();
    const { type_id: typeID, properties } = this.props.unit;

    // normalize date fields to 'yyyy-MM-dd' strings
    const { film_date: film } = properties;

    return {
      ...state,
      ...properties,
      type_id: typeID,
      film_date: toDateString(film),
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
