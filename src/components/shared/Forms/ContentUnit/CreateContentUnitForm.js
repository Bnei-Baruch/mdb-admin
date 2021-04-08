import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { Divider, Form, Label, Message, Search } from 'semantic-ui-react';
import {
  CONTENT_UNIT_TYPE_OPTIONS,
  MAJOR_LANGUAGES,
  CONTENT_UNIT_TYPES,
  CT_LESSON_PART,
  REQUIRED_LANGUAGES, EMPTY_ARRAY, DATE_FORMAT
} from '../../../../helpers/consts';
import { MajorLangsI18nField } from '../../Fields/index';
import BaseContentUnitForm from './BaseContentUnitForm';
import { actions, selectors } from '../../../../redux/modules/search';
import { selectors as collections } from '../../../../redux/modules/collections';
import { extractI18n } from '../../../../helpers/utils';
import { selectors as system } from '../../../../redux/modules/system';

class CreateContentUnitForm extends BaseContentUnitForm {
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
      film_date: moment.utc(),
      original_language: '',
      collection: {}
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
    const { i18n } = this.state;
    return MAJOR_LANGUAGES.reduce((acc, val) => {
      if (i18n[val].name.trim() !== '') {
        acc[val] = { ...i18n[val], language: val };
      }
      return acc;
    }, {});
  }

  getI18nErrors() {
    const errors   = {};
    // validate at least one valid translation
    const { i18n } = this.state;
    if (REQUIRED_LANGUAGES.some(x => i18n[x].name.trim() === '')) {
      errors.i18n = true;
    }

    return errors;
  }

  doSubmit(typeID, properties, i18n) {
    this.props.create(typeID, properties, i18n, this.state.collection);
  }

  handleSearchChange = (e, data) => {
    this.setState({ collection: {} });
    this.props.searchCollections(data.value);
  };

  handleSelect = (e, { result }) => {
    this.setState({ collection: result });
  };

  resultRenderer = ({ i18n }) => {
    const { currentLanguage } = this.props;
    const name                = extractI18n(i18n, ['name'], currentLanguage)[0];
    return <Label content={name} />;
  };

  renderAssociateCollection = () => {
    const { wip, err, items, currentLanguage } = this.props;
    const { collection: { i18n = {} } }        = this.state;

    const name = extractI18n(i18n, ['name'], currentLanguage)[0];
    return (
      <Form.Field error={err}>
        <label htmlFor="associate_collection">Associate Collection</label>
        <Search
          fluid
          id="associate_collection"
          loading={wip}
          onResultSelect={this.handleSelect}
          onSearchChange={this.handleSearchChange}
          results={items}
          value={name}
          resultRenderer={this.resultRenderer}
          className="search_association"
        />
      </Form.Field>
    );
  };

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

const mapState = (state) => {
  const cols      = selectors.getCollections(state.search);
  const denormIDs = collections.denormIDs(state.collections);
  return {
    wip: selectors.getWIP(state.search),
    err: selectors.getError(state.search),
    items: Array.isArray(cols) && cols.length > 0 ? denormIDs(cols) : EMPTY_ARRAY,
    currentLanguage: system.getCurrentLanguage(state.system),

  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    searchCollections: actions.searchCollections,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(CreateContentUnitForm);
