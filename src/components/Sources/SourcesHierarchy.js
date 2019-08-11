import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Grid, Header, Icon, List, Menu, Modal, Segment
} from 'semantic-ui-react';

import { FrownSplash, LoadingSplash } from '../shared/Splash';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';
import NewSourceForm from './NewSourceForm';

class SourcesHierarchy extends Component {
  static propTypes = {
    getSourceById: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    authors: PropTypes.arrayOf(shapes.Author),
    hierarchy: shapes.Hierarchy,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    authors: [],
    hierarchy: {
      roots: [],
      childMap: new Map(),
      currentLanguage: PropTypes.string.isRequired,
    }
  };

  constructor(props) {
    super(props);

    const { location, authors } = props;
    let author                  = location.state && location.state.author;
    if (!author && authors.length > 0) {
      author = authors[0];
    }

    this.state = {
      modalOpen: false,
      author,
      wip: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Hide modal if we're finished.
    // We're finished if wip is true in current props and false in next props without an error

    const nWip = props.getWIP('create');
    const nErr = props.getError('create');

    if (nErr || nWip)
      return { wip: true };

    let response = {};
    if (state.wip && !nWip && !nErr) {
      response.modalOpen = false;
      response.wip = false;
    }

    // set default author once we have authors if we need one
    if (!state.author && props.authors.length > 0) {
      response.author = props.authors[0];
      response.wip = false;
    }

    return Object.entries(response).length > 0 ? response : null;
  }

  showModal = () => this.setState({ modalOpen: true });

  hideModal = () => this.setState({ modalOpen: false });

  renderSources() {
    const { author }  = this.state;
    const { sources } = author;
    const hasSources  = Array.isArray(sources) && sources.length > 0;

    if (!hasSources) {
      return <FrownSplash text="No sources found in DB" subtext="Come on, go ahead and add some !" />;
    }

    const { getSourceById, currentLanguage } = this.props;

    return (
      <List relaxed divided className="rtl-dir">
        {sources.map((x) => {
          const source = getSourceById(x);
          const i18n   = extractI18n(source.i18n, ['name', 'description'], currentLanguage);

          const name        = i18n[0];
          const description = i18n[1];

          return (
            <List.Item key={source.id}>
              <List.Content>
                <List.Header>
                  <Link to={`/sources/${source.id}`}>{name}</Link>
                </List.Header>
                <List.Description>{description}</List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  }

  renderHierarchy() {
    const {
            authors, hierarchy, getWIP, currentLanguage
          } = this.props;

    const wip     = getWIP('fetchAll');
    const isEmpty = hierarchy.roots.length === 0 && hierarchy.childMap.size === 0;

    if (isEmpty) {
      return wip
        ? <LoadingSplash text="Loading sources hierarchy" subtext="With you in a second..." />
        : <FrownSplash text="No sources found in DB" subtext="Come on, go ahead and add some !" />;
    }

    const { author } = this.state;

    return (
      <Grid>
        <Grid.Row>
          {/* main content */}
          <Grid.Column stretched width={12}>
            {this.renderSources()}
          </Grid.Column>

          {/* menu */}
          <Grid.Column width={4}>
            <Menu fluid vertical tabular="right">
              {
                authors.map((x) => {
                  const name = extractI18n(x.i18n, ['name'], currentLanguage)[0];

                  return (
                    <Menu.Item
                      key={x.id}
                      active={x.id === author.id}
                      name={name}
                      onClick={() => this.setState({ author: x })}
                    >
                      {name}
                    </Menu.Item>
                  );
                })
              }
            </Menu>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    const { modalOpen } = this.state;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header content="Sources Collections" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.showModal}>
              <Icon name="plus" />
              New Collection
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Segment attached>
          {this.renderHierarchy()}
        </Segment>

        <Modal
          closeIcon
          centered={false}
          size="small"
          open={modalOpen}
          onClose={this.hideModal}
        >
          <Modal.Header>Create New Root Source</Modal.Header>
          <Modal.Content>
            <NewSourceForm {...this.props} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default SourcesHierarchy;
