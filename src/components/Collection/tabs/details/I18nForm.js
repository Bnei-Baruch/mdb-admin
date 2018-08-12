import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  Button, Flag, Header, Input, Menu, Segment, Table
} from 'semantic-ui-react';

import {
  ALL_LANGUAGES,
  LANG_MULTI,
  LANG_UNKNOWN,
  LANGUAGES,
  RTL_LANGUAGES,
  REQUIRED_LANGUAGES
} from '../../../../helpers/consts';
import { formatError, compareI18nWithMust } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/collections';
import * as shapes from '../../../shapes';
import LanguageSelector from '../../../shared/LanguageSelector';

class I18nForm extends Component {
  static propTypes = {
    updateI18n: PropTypes.func.isRequired,
    collection: shapes.Collection,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    collection: {
      i18n: {},
    },
    wip: false,
    err: null,
  };

  constructor(props) {
    super(props);

    const { i18n }                           = props.collection;
    const { i18nErrors, newI18n, addedKeys } = compareI18nWithMust(i18n, this.i18nObjectFromKey);

    this.state = {
      i18n: newI18n,
      addedKeys,
      submitted: false,
      errors: i18nErrors
    };
  }

  componentWillReceiveProps(nextProps) {
    const { i18n } = nextProps.collection;

    if (this.props.collection.i18n !== i18n) {
      const { i18nErrors, newI18n, addedKeys } = compareI18nWithMust(i18n, this.i18nObjectFromKey);
      this.setState({ i18n: newI18n, errors: i18nErrors, addedKeys });
    }
  }

  i18nObjectFromKey = language => ({
    language,
    name: '',
    description: ''
  });

  onNameChange = (e, { value }) => {
    const { i18n, errors } = this.state;
    const langKey          = e.target.name;

    if (REQUIRED_LANGUAGES.includes(langKey)) {
      errors[langKey] = !value;
    }
    i18n[langKey].name = value;
    this.setState({ i18n, errors });
  };

  onDescriptionChange = (e, { value }) => {
    const { i18n }                  = this.state;
    i18n[e.target.name].description = value;
    this.setState({ i18n });
  };

  addLanguage = (e, data) => {
    const { i18n }   = this.state;
    i18n[data.value] = this.i18nObjectFromKey(data.value);
    this.setState({ i18n });
  };

  removeLanguage = (language) => {
    const { i18n } = this.state;
    delete i18n[language];
    this.setState({ i18n });
  };

  handleSubmit = () => {
    const { collection, updateI18n } = this.props;
    const { i18n }                   = this.state;
    const data                       = Object.keys(i18n).map(x => i18n[x]);
    updateI18n(collection.id, data);

    this.setState({ submitted: true });
  };

  renderI18ns() {
    const { i18n, errors } = this.state;
    const keys             = Object.keys(i18n)
      .sort((a, b) => ALL_LANGUAGES.indexOf(a) - ALL_LANGUAGES.indexOf(b));

    return (
      <Table basic compact>
        <Table.Body>
          {keys.map(k => (
            <Table.Row key={k} error={errors[k]}>
              <Table.Cell collapsing>
                <Flag name={LANGUAGES[k].flag} />
                {LANGUAGES[k].text}
              </Table.Cell>
              <Table.Cell>
                <label htmlFor={`${k}.name`}>Name</label>
                <Input
                  fluid
                  id={`${k}.name`}
                  name={k}
                  value={i18n[k].name}
                  className={classNames({ 'bb-input': true, 'rtl-dir': RTL_LANGUAGES.includes(k) })}
                  onChange={this.onNameChange}
                />
                <label htmlFor={`${k}.description`}>Description</label>
                <Input
                  fluid
                  id={`${k}.description`}
                  name={k}
                  value={i18n[k].description || ''}
                  className={classNames({ 'bb-input': true, 'rtl-dir': RTL_LANGUAGES.includes(k) })}
                  onChange={this.onDescriptionChange}
                />
              </Table.Cell>
              <Table.Cell collapsing>
                {
                  !REQUIRED_LANGUAGES.includes(k)
                    ? (
                      <Button
                        circular
                        compact
                        size="mini"
                        icon="remove"
                        color="red"
                        inverted
                        onClick={() => this.removeLanguage(k)}
                      />
                    )
                    : null
                }

              </Table.Cell>
            </Table.Row>))
          }
        </Table.Body>
      </Table>
    );
  }

  render() {
    const { wip, err }                = this.props;
    const { i18n, submitted, errors } = this.state;

    const hasError = Object.keys(errors).some(e => errors[e]);
    const exclude  = [LANG_MULTI, LANG_UNKNOWN].concat(Object.keys(i18n));

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Translations" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <LanguageSelector
              item
              scrolling
              text="Add Language"
              exclude={exclude}
              onChange={this.addLanguage}
            />
          </Menu.Menu>
        </Menu>

        <Segment attached>
          {this.renderI18ns()}
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
            disabled={wip || hasError}
            onClick={this.handleSubmit}
          />
        </Segment>
      </div>
    );
  }
}

const mapState = state => ({
  wip: selectors.getWIP(state.collections, 'updateI18n'),
  err: selectors.getError(state.collections, 'updateI18n'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ updateI18n: actions.updateI18n }, dispatch);
}

export default connect(mapState, mapDispatch)(I18nForm);
