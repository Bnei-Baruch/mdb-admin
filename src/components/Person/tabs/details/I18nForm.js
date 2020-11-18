import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  Button, Flag, Header, Input, Menu, Message, Segment, Table
} from 'semantic-ui-react';

import {
  ALL_LANGUAGES, LANG_MULTI, LANG_UNKNOWN, LANGUAGES, RTL_LANGUAGES
} from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/persons';
import * as shapes from '../../../shapes';
import LanguageSelector from '../../../shared/LanguageSelector';

class I18nForm extends Component {
  static propTypes = {
    updateI18n: PropTypes.func.isRequired,
    person: shapes.Person,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    person: {
      i18n: {},
    },
    wip: false,
    err: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      i18n: { ...props.person.i18n },
      submitted: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.person) return null;

    if (props.person.i18n !== state.i18n) {
      return { i18n: props.person.i18n };
    }
    return null;
  }

  onNameChange = (e, { value }) => {
    const { i18n }           = this.state;
    i18n[e.target.name].name = value;
    this.setState({ i18n });
  };

  onDescriptionChange = (e, { value }) => {
    const { i18n }                  = this.state;
    i18n[e.target.name].description = value;
    this.setState({ i18n });
  };

  addLanguage = (e, data) => {
    const language = data.value;
    const { i18n } = this.state;
    i18n[language] = { language, name: '', description: '' };
    this.setState({ i18n });
  };

  removeLanguage = (language) => {
    const { i18n } = this.state;
    delete i18n[language];
    this.setState({ i18n });
  };

  handleSubmit = () => {
    const { person, updateI18n } = this.props;
    const { i18n }               = this.state;
    const data                   = Object.keys(i18n).map(x => i18n[x]);
    updateI18n(person.id, data);

    this.setState({ submitted: true });
  };

  renderI18ns() {
    const { i18n } = this.state;
    const keys     = Object.keys(i18n)
      .sort((a, b) => ALL_LANGUAGES.indexOf(a) - ALL_LANGUAGES.indexOf(b));

    if (keys.length === 0) {
      return <Message size="tiny">No translations found</Message>;
    }
    return (
      <Table basic compact>
        <Table.Body>
          {keys.map(k => (
            <Table.Row key={k}>
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
                <Button
                  circular
                  compact
                  size="mini"
                  icon="remove"
                  color="red"
                  inverted
                  onClick={() => this.removeLanguage(k)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  render() {
    const { wip, err }        = this.props;
    const { i18n, submitted } = this.state;
    const exclude             = [LANG_MULTI, LANG_UNKNOWN].concat(Object.keys(i18n));

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
            disabled={wip}
            onClick={this.handleSubmit}
          />
        </Segment>
      </div>
    );
  }
}

const mapState = state => ({
  wip: selectors.getWIP(state.persons, 'updateI18n'),
  err: selectors.getError(state.persons, 'updateI18n'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ updateI18n: actions.updateI18n }, dispatch);
}

export default connect(mapState, mapDispatch)(I18nForm);
