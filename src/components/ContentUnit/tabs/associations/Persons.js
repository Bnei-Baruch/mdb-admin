import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash/escapeRegExp';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';
import { Button, Header, List, Menu, Message, Segment, Search } from 'semantic-ui-react';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { formatError, extractI18n } from '../../../../helpers/utils';
import { actions, selectors } from '../../../../redux/modules/content_units';
import { selectors as personsSelectors, actions as personsAction } from '../../../../redux/modules/persons';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';

class Persons extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    addPerson: PropTypes.func.isRequired,
    removePerson: PropTypes.func.isRequired,
    persons: PropTypes.arrayOf(shapes.Person),
    status: shapes.AsyncStatusMap,
  };

  static defaultProps = {
    persons: EMPTY_ARRAY,
    status: EMPTY_OBJECT,
  };

  state = {
    query: '',
    searched: [],
  };

  componentDidMount() {
    this.resetComponent();
    if (this.props.persons.length === 0) {
      this.props.fetchAll();
    }
  }

  addPerson = (person) => {
    const { unit, persons, addPerson } = this.props;
    if (persons.findIndex(x => x.id === person.id) === -1) {
      addPerson(unit.id, person.id);
    }
  };

  removePerson = (tag) => {
    const { unit, removePerson } = this.props;
    removePerson(unit.id, tag.id);
  };

  renderStatusMessage = () => {
    const { status } = this.props;

    if (status.addPerson.wip) {
      return <Header content="Adding Person..." icon={{ name: 'spinner', loading: true }} size="tiny" />;
    } else if (status.removePerson.wip) {
      return <Header content="Removing Person..." icon={{ name: 'spinner', loading: true }} size="tiny" />;
    }

    const err = status.addPerson.err || status.removePerson.err;
    if (err) {
      return <Header content={formatError(err)} icon={{ name: 'warning sign' }} color="red" size="tiny" />;
    }
    return null;
  };

  handleResultSelect = (e, data) => {
    this.addPerson(data.result);
    this.resetComponent();
  };

  handleSearchChange = (e, data) => {
    const query = escapeRegExp(data.value.trim());
    if (query === '') {
      this.resetComponent();
      return;
    }
    this.setState({ query });
    this.doFilter();
  };

  doFilter = debounce(() => {
    const regExp   = new RegExp(escapeRegExp(this.state.query), 'i');
    const searched = this.props.allPersons
      .filter(r => (regExp.test(extractI18n(r.i18n, ['name']))));
    this.setState({ searched });
  }, 150);

  resetComponent = () => this.setState({ searched: [], query: '' });

  renderResult = (person) => {
    const { id, i18n } = person;
    return <div key={id}>{extractI18n(i18n, ['name'])}</div>;
  };

  render() {
    const { persons, status } = this.props;
    const { query, searched } = this.state;
    const { wip, err }        = status.fetchItemPersons;

    let content;
    if (err) {
      content = <ErrorSplash text="Server Error" subtext={formatError(err)} />;
    } else if (persons.length === 0) {
      content = wip ?
        <LoadingSplash text="Loading persons" /> :
        <Message>No persons found for this unit</Message>;
    } else {
      content = (
        <List relaxed divided className="rtl-dir">
          {
            persons.map(x =>
              (
                <List.Item key={x.id}>
                  <List.Content floated="left">
                    <Button
                      circular
                      compact
                      size="mini"
                      icon="remove"
                      color="red"
                      inverted
                      onClick={() => this.removePerson(x)}
                    />
                  </List.Content>
                  <List.Content>
                    <Link to={`/persons/${x.id}`}>
                      {extractI18n(x.i18n, ['name'])}
                    </Link>
                  </List.Content>
                </List.Item>
              )
            )
          }
        </List>
      );
    }

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Persons" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Search
                aligned="right"
                placeholder="הוסף פרסון"
                className="rtl-dir"
                noResultsMessage="לא נמצאו תגיות."
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                resultRenderer={this.renderResult}
                results={searched}
                value={query}
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Segment attached>
          {content}
          {this.renderStatusMessage()}
        </Segment>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { unit = EMPTY_OBJECT } = ownProps;
  const personIDs               = unit.persons;
  const denormIDs               = personsSelectors.denormIDs(state.persons);

  const status = ['fetchItemPersons', 'addPerson', 'removePerson']
    .reduce((acc, val) => {
      acc[val] = {
        wip: selectors.getWIP(state.content_units, val),
        err: selectors.getError(state.content_units, val),
      };
      return acc;
    }, {});

  return {
    status,
    allPersons: personsSelectors.getPersonList(state.persons),
    persons: personIDs ? denormIDs(personIDs) : EMPTY_ARRAY,
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchItemPersons: actions.fetchItemPersons,
  fetchAll: personsAction.fetchAll,
  addPerson: actions.addPerson,
  removePerson: actions.removePerson,
}, dispatch);

export default connect(mapState, mapDispatch)(Persons);
