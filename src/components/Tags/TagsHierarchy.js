import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Grid, Header, Icon, Label, List, Menu, Modal, Segment
} from 'semantic-ui-react';

import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';
import { FrownSplash, LoadingSplash } from '../shared/Splash';
import NewTagForm from './NewTagForm';

class TagsHierarchy extends Component {
  static propTypes = {
    getTagById: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    hierarchy: shapes.Hierarchy,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    hierarchy: {
      roots: [],
      childMap: new Map()
    }
  };

  constructor(props) {
    super(props);

    const { roots } = props.hierarchy;
    this.state      = {
      wip: false,
      modalOpen: false,
      shownRoot: roots.length > 0 ? roots[0] : null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Hide modal if we're finished.
    // We're finished if wip is true in current props and false in next props without an error
    const { wip } = state;
    const nWip    = props.getWIP('create');
    const nErr    = props.getError('create');
    let response  = {};

    if (!wip && nWip) {
      response.wip = nWip;
    }

    if (wip && !nWip && !nErr) {
      response.modalOpen = false;
      response.wip       = false;
    }

    // Set shown root once we have the hierarchy available
    if (state.shownRoot === null && props.hierarchy.roots.length > 0) {
      response.shownRoot = props.hierarchy.roots[0];
    }

    return Object.entries(response).length > 0 ? response : null;
  }

  showModal = () => this.setState({ modalOpen: true });

  hideModal = () => this.setState({ modalOpen: false });

  renderNode(node) {
    const { getTagById, hierarchy, currentLanguage } = this.props;

    const children    = hierarchy.childMap.get(node.id);
    const hasChildren = Array.isArray(children) && children.length > 0;
    const label       = extractI18n(node.i18n, ['label'], currentLanguage)[0];

    return (
      <List.Item key={node.id}>
        <List.Content>
          <List.Header>
            <Link to={`/tags/${node.id}`}>{label}</Link>
            &nbsp;&nbsp;
            {hasChildren ? <Label circular color="teal" size="tiny">{children.length}</Label> : null}
          </List.Header>
          <List.Description>{node.description}</List.Description>
          {
            hasChildren
              ? (
                <List.List className="rtl-dir">
                  {children.map(x => this.renderNode(getTagById(x)))}
                </List.List>
              )
              : null
          }
        </List.Content>
      </List.Item>
    );
  }

  renderHierarchy() {
    const { getTagById, hierarchy, getWIP, currentLanguage } = this.props;

    const wip     = getWIP('fetchAll');
    const isEmpty = hierarchy.roots.length === 0 && hierarchy.childMap.size === 0;

    if (isEmpty) {
      return wip
        ? <LoadingSplash text="Loading tags hierarchy" subtext="With you in a second..." />
        : <FrownSplash text="No tags found in DB" subtext="Come on, go ahead and add some !" />;
    }

    const root       = getTagById(this.state.shownRoot);
    const rootChilds = hierarchy.childMap.get(root.id);

    return (
      <Grid>
        <Grid.Row>
          {/* main content */}
          <Grid.Column stretched width={12}>
            <List relaxed divided className="rtl-dir">
              {
                Array.isArray(rootChilds) && rootChilds.length > 0
                  ? rootChilds.map(x => this.renderNode(getTagById(x)))
                  : <Header sub color="grey">This tag has no children</Header>
              }
            </List>
          </Grid.Column>

          {/* menu */}
          <Grid.Column width={4}>
            <Menu fluid vertical tabular="right">
              {
                hierarchy.roots.map((x) => {
                  const node        = getTagById(x);
                  const children    = hierarchy.childMap.get(x);
                  const hasChildren = Array.isArray(children) && children.length > 0;
                  const label       = extractI18n(node.i18n, ['label'], currentLanguage)[0];
                  return (
                    <Menu.Item
                      key={x}
                      as="div"
                      active={x === root.id}
                      onClick={() => this.setState({ shownRoot: x })}
                    >
                      <Header size="small" textAlign="right">
                        <Header.Content>
                          <Label
                            circular
                            color="teal"
                            size="tiny"
                            content={hasChildren ? children.length : 0}
                          />
                          <Link to={`/tags/${x}`}>{label}</Link>
                          <Header.Subheader>
                            {node.description}
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
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
            <Header content="Tags Hierarchy" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.showModal}>
              <Icon name="plus" />
              New Root
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
          <Modal.Header>Create New Root Tag</Modal.Header>
          <Modal.Content>
            <NewTagForm {...this.props} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default TagsHierarchy;
