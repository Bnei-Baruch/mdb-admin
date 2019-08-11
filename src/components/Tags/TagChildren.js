import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Header, Icon, Label, List, Menu, Modal, Segment
} from 'semantic-ui-react';

import { EMPTY_OBJECT } from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';
import NewTagForm from './NewTagForm';

class TagChildren extends Component {
  static propTypes = {
    getTagById: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    tag: shapes.Tag,
    hierarchy: shapes.Hierarchy,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    tag: EMPTY_OBJECT,
    hierarchy: {
      childMap: new Map()
    }
  };

  state = {
    modalOpen: false,
    wip: false
  };

  static getDerivedStateFromProps(props, state) {
    // Hide modal if we're finished.
    // We're finished if wip is true in current props and false in next props without an error

    const nWip = props.getWIP('create');
    const nErr = props.getError('create');
    if (nErr || nWip) {
      return { wip: true };
    }

    if (state.wip && !nWip && !nErr) {
      return { modalOpen: false, wip: false };
    }

    return null;
  }

  showModal = () => this.setState({ modalOpen: true });

  hideModal = () => this.setState({ modalOpen: false });

  renderNode(node) {
    const { getTagById, hierarchy, currentLanguage } = this.props;
    const children                                   = hierarchy.childMap.get(node.id);
    const hasChildren                                = Array.isArray(children) && children.length > 0;
    const label                                      = extractI18n(node.i18n, ['label'], currentLanguage)[0];

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

  render() {
    const { tag, hierarchy, getTagById } = this.props;
    const children                       = hierarchy.childMap.get(tag.id);
    const hasChildren                    = Array.isArray(children) && children.length > 0;
    const { modalOpen }                  = this.state;

    return (
      <div>
        <Menu attached borderless size="large">
          <Menu.Item header>
            <Header size="medium" color="blue">
              Children
              <Label circular color="teal" content={hasChildren ? children.length : 0} />
            </Header>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.showModal}>
              <Icon name="plus" />
              New Child
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Segment attached>
          {
            hasChildren
              ? (
                <List relaxed divided className="rtl-dir">
                  {children.map(x => this.renderNode(getTagById(x)))}
                </List>
              )
              : <Header sub color="grey">This tag has no children</Header>
          }
        </Segment>

        <Modal
          closeIcon
          centered={false}
          size="small"
          open={modalOpen}
          onClose={this.hideModal}
        >
          <Modal.Header>Create New Tag</Modal.Header>
          <Modal.Content>
            <NewTagForm {...this.props} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default TagChildren;
