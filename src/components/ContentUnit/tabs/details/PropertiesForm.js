import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Menu, Segment, Form, Input, Flag, Button } from 'semantic-ui-react';
import moment from 'moment';

import { actions, selectors } from '../../../../redux/modules/content_units';
import * as shapes from '../../../shapes';

import { formatError } from '../../../../helpers/utils';
import { FilmDateField } from '../../../shared/Fields';
import LanguageSelector from '../../../shared/LanguageSelector';
import { LANGUAGES } from '../../../../helpers/consts';

class PropertiesForm extends Component {

  static propTypes = {
    contentUnit: shapes.ContentUnit.isRequired,
    wip: PropTypes.bool,
    err: shapes.Error,
  };

  static defaultProps = {
    wip: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...props.properties,
      errors: props.err || {},
    };
  }

  handleFilmDateChange = (value) => {
    const errors = this.state.errors;
    delete errors.film_date;
    this.setState({ film_date: value, errors });
  };
  handleDuration       = (e, { value }) => {
    const errors = this.state.errors;
    delete errors.duration;
    this.setState({ duration: value, errors });
  };

  handleChangeLanguage = (e, { value }) => {
    const errors = this.state.errors;
    delete errors.original_language;
    this.setState({ original_language: value });
  };

  handleSubmit = () => {
    const { updateProperties, contentUnit }          = this.props;
    const { original_language, duration, film_date } = this.state;
    if (this.validate()) {
      return;
    }
    const data = { original_language, duration, film_date };
    updateProperties(contentUnit.id, data);

    this.setState({ submitted: true });
  };

  validate = () => {
    let { original_language, film_date, errors } = this.state;
    errors                                       = {};
    if (!film_date) {
      errors.film_date = true;
    }
    if (!original_language) {
      errors.original_language = true;
    }
    this.setState({ errors });
    return Object.keys(errors).length > 0;
  };

  renderDuration = () => {
    const { duration, errors } = this.state;
    return (
      <Form.Field
        error={errors.duration}>
        <label htmlFor='capture_date'>Duration</label>
        <Input
          type="number"
          value={duration}
          className="form-control"
          placeholder="duration"
          onChange={this.handleDuration}
          style={{ width: '100%', zIndex: 1000 }}
        />
      </Form.Field>);
  };

  renderOriginLanguage = () => {
    const { original_language } = this.state;
    let currentLang             = 'Please select';

    if (original_language) {
      currentLang = (<div>
        <Flag name={LANGUAGES[original_language].flag} />
        {LANGUAGES[original_language].text}
      </div>);
    }

    return (<Form.Field
      error={this.state.errors.original_language}>
      <label>Original language</label>
      <Menu borderless size="small">
        <Menu.Item>
          {currentLang}
        </Menu.Item>
        <Menu.Menu position="right">
          <LanguageSelector
            item
            scrolling
            text="Change Language"
            exclude={[original_language]}
            onChange={this.handleChangeLanguage}
          />
        </Menu.Menu>
      </Menu>
    </Form.Field>);
  };

  render() {
    const { errors, film_date, submitted } = this.state;
    const { wip }                          = this.props;
    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Editable properties" size="medium" color="blue" />
          </Menu.Item>
        </Menu>
        <Segment attached>

          <Form>
            {this.renderDuration()}
            <FilmDateField
              value={moment(film_date)}
              err={errors.film_date}
              onChange={this.handleFilmDateChange}
              required />
            {this.renderOriginLanguage()}
          </Form>

        </Segment>

        <Segment clearing attached="bottom" size="tiny">
          {submitted && Object.keys(errors).length > 0 ?
            <Header
              inverted
              content={formatError(errors)}
              color="red"
              icon="warning sign"
              floated="left"
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
      </div>
    );
  }
}

const mapState = state => ({
  wip: selectors.getWIP(state.collections, 'updateProperties'),
  err: selectors.getError(state.collections, 'updateProperties'),
});

function mapDispatch(dispatch) {
  return bindActionCreators({ updateProperties: actions.updateProperties }, dispatch);
}

export default connect(mapState, mapDispatch)(PropertiesForm);
