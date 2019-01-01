import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Divider, Flag, Form, Header, Input, Message, Segment
} from 'semantic-ui-react';

import {
  LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, MAJOR_LANGUAGES
} from '../../helpers/consts';
import { formatError, isValidPattern } from '../../helpers/utils';
import * as shapes from '../shapes';

class NewTagForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    tag: shapes.Tag,
  };

  static defaultProps = {
    tag: null
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      description: '',
      pattern: '',
      labels: {
        [LANG_HEBREW]: '',
        [LANG_RUSSIAN]: '',
        [LANG_ENGLISH]: '',
        [LANG_SPANISH]: '',
      },
      submitted: false,
      errors: {},
    };
  }

  onDescriptionChange = (e, { value }) => {
    this.setState({ description: value });
  };

  onPatternChange = (e, { value }) => {
    const { errors } = this.state;
    if (isValidPattern(value)) {
      delete errors.pattern;
    } else {
      errors.pattern = true;
    }

    this.setState({ pattern: value, errors });
  };

  onLabelChange = (e, { value }, language) => {
    const { errors } = this.state;
    if (errors.labels && value.trim() !== '') {
      delete errors.labels;
    }

    this.setState({ errors, labels: { ...this.state.labels, [language]: value } });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validate()) {
      return;
    }

    const parent              = this.props.tag;
    const { pattern, labels } = this.state;
    const description         = this.state.description.trim();
    const i18n                = {};
    Object.keys(labels)
      .map(x => ({ language: x, label: labels[x].trim() }))
      .filter(x => x.label !== '')
      .forEach((x) => {
        i18n[x.language] = x;
      });

    this.props.create(parent ? parent.id : null, pattern, description, i18n);

    this.setState({ submitted: true });
  };

  validate() {
    const { pattern, labels } = this.state;
    const errors              = {};

    if (!isValidPattern(pattern)) {
      errors.pattern = true;
    }

    if (MAJOR_LANGUAGES.every(x => labels[x].trim() === '')) {
      errors.labels = true;
    }

    this.setState({ errors });

    return !errors.pattern && !errors.labels;
  }

  render() {
    const { getWIP, getError } = this.props;
    const wip                  = getWIP('create');
    const err                  = getError('create');

    const {
      description, pattern, labels, submitted, errors
    } = this.state;

    return (
      <Segment.Group>
        <Segment basic>
          <Form onSubmit={this.handleSubmit}>
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
              <small className="helper">A short description about this tag</small>
            </Form.Field>

            <Divider horizontal section>Translations</Divider>

            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="he.name"><Flag name="il" />Hebrew</label>
                <Input
                  id="he.name"
                  placeholder="Label in Hebrew"
                  value={labels[LANG_HEBREW]}
                  onChange={(e, x) => this.onLabelChange(e, x, LANG_HEBREW)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="ru.name"><Flag name="ru" />Russian</label>
                <Input
                  id="ru.name"
                  placeholder="Label in Russian"
                  value={labels[LANG_RUSSIAN]}
                  onChange={(e, x) => this.onLabelChange(e, x, LANG_RUSSIAN)}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <label htmlFor="en.name"><Flag name="us" />English</label>
                <Input
                  id="en.name"
                  placeholder="Label in English"
                  value={labels[LANG_ENGLISH]}
                  onChange={(e, x) => this.onLabelChange(e, x, LANG_ENGLISH)}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="es.name"><Flag name="es" />Spanish</label>
                <Input
                  id="es.name"
                  placeholder="Label in Spanish"
                  value={labels[LANG_SPANISH]}
                  onChange={(e, x) => this.onLabelChange(e, x, LANG_SPANISH)}
                />
              </Form.Field>
            </Form.Group>

            {
              errors.labels
                ? <Message negative content="At least one translation is required" />
                : null
            }
          </Form>
        </Segment>

        <Segment clearing attached="bottom" size="tiny">
          {
            submitted && err
              ? (
                <Header
                  inverted
                  content={formatError(err)}
                  color="red"
                  icon="warning sign"
                  floated="left"
                  size="tiny"
                  style={{ marginTop: '0.2rem', marginBottom: '0' }}
                />
              )
              : null
          }
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

export default NewTagForm;
