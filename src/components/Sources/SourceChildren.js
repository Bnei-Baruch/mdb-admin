import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Label, List, Menu, Modal, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { EMPTY_OBJECT } from '../../helpers/consts';
import { extractI18n } from '../../helpers/utils';
import * as shapes from '../shapes';
import NewSourceForm from './NewSourceForm';

class SourceChildren extends Component {

  static propTypes = {
    getSourceById: PropTypes.func.isRequired,
    getWIP: PropTypes.func.isRequired,
    getError: PropTypes.func.isRequired,
    source: shapes.Source,
    hierarchy: shapes.Hierarchy,
  };

  static defaultProps = {
    source: EMPTY_OBJECT,
    hierarchy: {
      childMap: new Map()
    }
  };

  state = {
    modalOpen: false
  };

  componentWillReceiveProps(nextProps) {
    // Hide modal if we're finished.
    // We're finished if wip is true in current props and false in next props without an error
    const wip  = this.props.getWIP('create');
    const nWip = nextProps.getWIP('create');
    const nErr = nextProps.getError('create');
    if (wip && !nWip && !nErr) {
      this.hideModal();
    }
  }

  showModal = () => this.setState({ modalOpen: true });
  hideModal = () => this.setState({ modalOpen: false });

  render() {
    const { source, hierarchy, getSourceById } = this.props;
    const children                             = hierarchy.childMap.get(source.id);
    const hasChildren                          = Array.isArray(children) && children.length > 0;
    const modalOpen                            = this.state.modalOpen;

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
            hasChildren ?
              <List relaxed divided className="rtl-dir">
                {children.map((x, i) => {
                  const node  = getSourceById(x);
                  const label = extractI18n(node.i18n, ['name'])[0];

                  return (
                    <List.Item key={node.id}>
                      <List.Content>
                        <List.Header>
                          <Link to={`/sources/${node.id}`}>{i + 1}. {label}</Link>
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  );
                })}
              </List> :
              <Header sub color="grey">This source has no children</Header>
          }
        </Segment>

        <Modal
          closeIcon
          size="small"
          open={modalOpen}
          onClose={this.hideModal}
        >
          <Modal.Header>Create New Source</Modal.Header>
          <Modal.Content>
            <NewSourceForm {...this.props} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default SourceChildren;
