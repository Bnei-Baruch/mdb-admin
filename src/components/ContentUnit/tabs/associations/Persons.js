import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash/escapeRegExp';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Header, List, Menu, Message, Segment, Search } from 'semantic-ui-react';

import { actions, selectors } from '../../../../redux/modules/content_units';
import { selectors as personsSelectors } from '../../../../redux/modules/persons';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import { formatError, extractI18n } from '../../../../helpers/utils';
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

  addPerson = (tag) => {
    const { unit, tags, addPerson } = this.props;
    if (tags.findIndex(x => x.id === tag.id) === -1) {
      addPerson(unit.id, tag.id);
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

  };

  handleSearchChange = (e, data) => {
    const searched = this.state.searched.length > 0 ? this.state.searched : this.props.persons;
    this.setState({ query: data.value });
    setTimeout(() => {
      if (data.value.length < 1) return this.setState({ searched: [] });

      const regExp = new RegExp(escapeRegExp(data.value), 'i');
      this.setState({
        searched: searched.filter(r => (regExp.test(extractI18n(r.i18n, ['name'])))),
      });
    }, 150);
  };

  renderResult = (person) => {
    return <div key={person.id}>{extractI18n(person.i18n, ['name'])}</div>;
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
                    {extractI18n(x.i18n, ['name'])}
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
    persons: personIDs ? denormIDs(personIDs) : EMPTY_ARRAY,
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchItemPersons: actions.fetchItemPersons,
  addPerson: actions.addPerson,
  removePerson: actions.removePerson,
}, dispatch);

export default connect(mapState, mapDispatch)(Persons);
