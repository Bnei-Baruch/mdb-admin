import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Flag, Form, Header, Input, Message, Segment } from 'semantic-ui-react';

import {
  EMPTY_ARRAY,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  MAJOR_LANGUAGES,
  SOURCE_TYPES_OPTIONS
} from '../../helpers/consts';
import { extractI18n, formatError, isValidPattern } from '../../helpers/utils';
import * as shapes from '../shapes';

class NewSourceForm extends Component {

  static propTypes = {
    create: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    source: shapes.Source,
    authors: PropTypes.arrayOf(shapes.Author),
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    source: null,
    authors: EMPTY_ARRAY,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const i18n = {};
    MAJOR_LANGUAGES.forEach((l) => {
      i18n[l] = { name: '' };
    });

    return {
      description: '',
      pattern: '',
      i18n,
      author: null,
      type_id: 1,
      submitted: false,
      errors: {},
    };
  }

  onAuthorChange = (e, { value }) => {
    this.setState({ author: value });
  };

  onTypeChange = (e, { value }) => {
    this.setState({ type_id: value });
  };

  onDescriptionChange = (e, { value }) => {
    this.setState({ description: value });
  };

  onPatternChange = (e, { value }) => {
    const errors = this.state.errors;
    if (isValidPattern(value)) {
      delete errors.pattern;
    } else {
      errors.pattern = true;
    }

    this.setState({ pattern: value, errors });
  };

  onI18nNameChange = (e, { value }, language) => {
    const { errors, i18n } = this.state;
    if (errors.labels && value.trim() !== '') {
      delete errors.labels;
    }
    i18n[language].name = value;
    this.setState({ errors, i18n });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validate()) {
      return;
    }

    const parent                             = this.props.source;
    const { pattern, i18n, author, type_id } = this.state;
    const description                        = this.state.description.trim();
    const nI18n                              = {};

    Object.keys(i18n)
      .filter(x => i18n[x].name !== '')
      .forEach((x) => {
        nI18n[x] = {
          language: x,
          name: i18n[x].name.trim()
        };
      });

    this.props.create(parent ? parent.id : null, pattern, description, nI18n, author, type_id);

    this.setState({ submitted: true });
  };

  validate() {
    const { pattern, i18n } = this.state;
    const errors            = {};

    if (!isValidPattern(pattern)) {
      errors.pattern = true;
    }

    if (MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].name.trim() === '')) {
      errors.labels = true;
    }

    this.setState({ errors });

    return !errors.pattern && !errors.labels;
  }

  render() {
    const { getWIP, getError, source, authors, currentLanguage } = this.props;

    const wip = getWIP('create');
    const err = getError('create');

    const { author, type_id: typeID, description, pattern, i18n, submitted, errors } = this.state;

    const authorsOptions = source ? null : authors.map(x => ({
      text: extractI18n(x.i18n, ['name'], currentLanguage)[0],
      value: x.id
    }));

    return (
      <Segment.Group>
        <Segment basic>
          <Form onSubmit={this.handleSubmit}>
            {
              source ?
                null :
                <Form.Field>
                  <label htmlFor="author">Author</label>
                  <Form.Select
                    id="author"
                    placeholder="Author"
                    value={author || ''}
                    options={authorsOptions}
                    onChange={this.onAuthorChange}
                  />
                </Form.Field>
            }

            <Form.Field>
              <label htmlFor="type">Type</label>
              <Form.Select
                id="type"
                placeholder="Type"
                value={typeID}
                options={SOURCE_TYPES_OPTIONS}
                onChange={this.onTypeChange}
              />
            </Form.Field>

            <Form.Field error={Boolean(errors.pattern)}>
              <label htmlFor="pattern">Pattern</label>
              <Input
                id="pattern"
                placeholder="Pattern"
                value={pattern}
                onChange={this.onPatternChange}
              />
              <small className="helper">
                Used in physical file names.
                English words separated with &lsquo;-&rsquo;
              </small>
            </Form.Field>

            <Form.Field>
              <label htmlFor="description">Description</label>
              <Input
                id="description"
                placeholder="Description"
                value={description}
                onChange={this.onDescriptionChange}
              />
              <small className="helper">A short description about this source</small>
            </Form.Field>

            <Divider horizontal section>Translations</Divider>

            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="he.name"><Flag name="il" />Hebrew</label>
                <Input
                  id="he.name"
                  placeholder="Name in Hebrew"
                  value={i18n[LANG_HEBREW].name}
                  onChange={(e, x) => this.onI18nNameChange(e, x, LANG_HEBREW)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="ru.name"><Flag name="ru" />Russian</label>
                <Input
                  id="ru.name"
                  placeholder="Name in Russian"
                  value={i18n[LANG_RUSSIAN].name}
                  onChange={(e, x) => this.onI18nNameChange(e, x, LANG_RUSSIAN)}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="en.name"><Flag name="us" />English</label>
                <Input
                  id="en.name"
                  placeholder="Name in English"
                  value={i18n[LANG_ENGLISH].name}
                  onChange={(e, x) => this.onI18nNameChange(e, x, LANG_ENGLISH)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="es.name"><Flag name="es" />Spanish</label>
                <Input
                  id="es.name"
                  placeholder="Name in Spanish"
                  value={i18n[LANG_SPANISH].name}
                  onChange={(e, x) => this.onI18nNameChange(e, x, LANG_SPANISH)}
                />
              </Form.Field>
            </Form.Group>

            {
              errors.labels ?
                <Message negative content="At least one translation is required" /> :
                null
            }
          </Form>
        </Segment>

        <Segment clearing attached="bottom" size="tiny">
          {submitted && err ?
            <Header
              inverted
              content={formatError(err)}
              color="red"
              icon="warning sign"
              floated="left"
              size="tiny"
              style={{ marginTop: '0.2rem', marginBottom: '0' }}
            />
            : null}
          <Button
            primary
            content="Save"
            size="tiny"
            floated="right"
            loading={wip}
            disabled={wip}
            onClick={this.handleSubmit}
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default NewSourceForm;
