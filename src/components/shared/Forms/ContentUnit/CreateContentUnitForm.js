import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { Divider, Form, Label, List, Message, Search, Segment } from 'semantic-ui-react';
import {
  CONTENT_UNIT_TYPE_OPTIONS,
  MAJOR_LANGUAGES,
  CONTENT_UNIT_TYPES,
  CT_LESSON_PART,
  REQUIRED_LANGUAGES,
  EMPTY_ARRAY,
  CONTENT_TYPE_BY_ID
} from '../../../../helpers/consts';
import { MajorLangsI18nField } from '../../Fields/index';
import BaseContentUnitForm from './BaseContentUnitForm';
import { actions, selectors } from '../../../../redux/modules/search';
import { actions as unitActions, selectors as unitSelectors } from '../../../../redux/modules/content_units';
import { selectors as collections } from '../../../../redux/modules/collections';
import { extractI18n } from '../../../../helpers/utils';
import { selectors as system } from '../../../../redux/modules/system';

class CreateContentUnitForm extends BaseContentUnitForm {
  static getDerivedStateFromProps(props, state) {
    const { wipAutoname, errAutoname, autonameI18n } = props;
    const { autonameLoaded, i18n }                   = state;

    if (wipAutoname) {
      return { autonameLoaded: false };
    }

    if (!autonameLoaded && (!wipAutoname || errAutoname)) {
      const nI18n = {};
      for (const k of Object.keys(i18n)) {
        const name = autonameI18n.find(x => x.language === k)?.name;
        nI18n[k]   = { name };
      }
      return { autonameLoaded: true, i18n: nI18n };
    }

    return null;
  }

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
      collection: {},
      autonameLoaded: true
    };
  }

  handleTypeChange = (e, data) => {
    const type_id = data.value;
    const uid     = this.state.collection?.uid;
    if (uid) this.props.autoname(uid, type_id);
    this.setState({ type_id });
  };

  handleI18nChange = (dataI18n) => {
    const { errors, i18n } = this.state;
    if (!MAJOR_LANGUAGES.every(x => dataI18n[x] && dataI18n[x].name.trim() === '')) {
      delete errors.i18n;
    }
    const nI18n = {};
    for (const k of Object.keys(i18n)) {
      //dont take from i18n on delete letters

      if (dataI18n[k]?.name) nI18n[k] = dataI18n[k];
      else if (i18n[k].name?.length > 1) nI18n[k] = i18n[k];
      else nI18n[k] = { name: '' };
    }
    this.setState({ errors, i18n: nI18n });
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
    this.props.autoname(result.uid, this.state.type_id);
  };

  resultRenderer = ({ i18n, type_id }) => {
    const { currentLanguage } = this.props;
    const name                = extractI18n(i18n, ['name'], currentLanguage)[0];
    return (
      <div>
        {name}
        <div style={{ float: 'right' }}>
          <Label>{CONTENT_TYPE_BY_ID[type_id]}</Label>
        </div>
      </div>
    );
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
    autonameI18n: unitSelectors.getAutonameI18n(state.content_units) || [],
    wipAutoname: unitSelectors.getWIP(state.content_units, 'autoname'),
    errAutoname: unitSelectors.getError(state.content_units, 'autoname'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    searchCollections: actions.searchCollections,
    autoname: unitActions.autoname,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(CreateContentUnitForm);
