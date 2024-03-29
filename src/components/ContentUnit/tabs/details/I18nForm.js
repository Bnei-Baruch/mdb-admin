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
import { actions, selectors } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';
import LanguageSelector from '../../../shared/LanguageSelector';

class I18nForm extends Component {
  constructor(props) {
    super(props);

    const { i18n }                = props.unit;
    const { i18nErrors, newI18n } = compareI18nWithMust(i18n, this.i18nObjectFromKey);

    this.state = {
      i18n: newI18n,
      submitted: false,
      errors: i18nErrors
    };
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
    const { unit, updateI18n } = this.props;
    const { i18n }             = this.state;

    const data = Object.keys(i18n).map(x => i18n[x]);
    updateI18n(unit.id, data);

    this.setState({ submitted: true });
  };

  renderI18ns() {
    const { i18n, errors } = this.state;
    const { disabled }     = this.props;
    const keys             = Object.keys(i18n)
      .sort((a, b) => ALL_LANGUAGES.indexOf(a) - ALL_LANGUAGES.indexOf(b));

    return (
      <Table basic compact>
        <Table.Body>
          {keys.map(k => (
            <Table.Row key={k} error={errors[k]}>
              <Table.Cell collapsing>
                <Flag name={LANGUAGES[k]?.flag} />
                {LANGUAGES[k]?.text}
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
                  disabled={disabled}
                />
                <label htmlFor={`${k}.description`}>Description</label>
                <Input
                  fluid
                  id={`${k}.description`}
                  name={k}
                  value={i18n[k].description || ''}
                  className={classNames({ 'bb-input': true, 'rtl-dir': RTL_LANGUAGES.includes(k) })}
                  onChange={this.onDescriptionChange}
                  disabled={disabled}
                />
              </Table.Cell>
              <Table.Cell collapsing>
                {
                  !REQUIRED_LANGUAGES.includes(k)
                    ? (
                      <Button
                        circular
                        compact
                        inverted
                        size="mini"
                        icon="remove"
                        color="red"
                        onClick={() => this.removeLanguage(k)}
                        disabled={disabled}
                      />
                    )
                    : null
                }
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  render() {
    const { wip, err, disabled }      = this.props;
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
              value="none"
              text="Add Language"
              exclude={exclude}
              onChange={this.addLanguage}
              disabled={disabled}
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
            disabled={wip || hasError || disabled}
            onClick={this.handleSubmit}
          />
        </Segment>
      </div>
    );
  }
}

I18nForm.propTypes = {
  updateI18n: PropTypes.func.isRequired,
  unit: shapes.ContentUnit,
  wip: PropTypes.bool,
  err: shapes.Error,
  disabled: PropTypes.bool,
};

I18nForm.defaultProps = {
  unit: {
    i18n: {},
  },
  wip: false,
  err: null,
  disabled: false
};

const mapState = state => ({
  wip: selectors.getWIP(state.content_units, 'updateI18n'),
  err: selectors.getError(state.content_units, 'updateI18n'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ updateI18n: actions.updateI18n }, dispatch);
}

export default connect(mapState, mapDispatch)(I18nForm);
