import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Menu, Icon, Header, Button, Sticky } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { actions, selectors } from '../../../../redux/modules/collections';
import Units from './Units';
import './style.css';

class AssociationsContainer extends Component {

  static propTypes = {
    updateItemUnitProperties: PropTypes.func.isRequired,
    fetchItemUnits: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  static defaultProps = {
    collection: null,
  };

  state = {
    selectedCCU: []
  };

  componentDidMount() {
    const { collection } = this.props;
    if (collection) {
      this.askForData(collection.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collection && !this.props.collection &&
      nextProps.collection.id !== this.props.collection.id) {
      this.askForData(nextProps.collection.id);
    }
  }

  askForData(id) {
    this.props.fetchItemUnits(id);
  }

  updatePosition = (isUp) => {
    const { units }      = this.props;
    const { selectedCCU } = this.state;
    const basePosition   = selectedCCU[0].position;
    const currentIndex   = units.findIndex(cu => selectedCCU[0].content_unit_id === cu.content_unit_id);
    const cuIndex        = currentIndex + (isUp ? -1 : 1);
    const cu             = units[cuIndex];

    let newPosition = cu.position;
    if (basePosition === cu.position) {
      newPosition = isUp ? basePosition + 1 : basePosition - 1;
    }

    selectedCCU[0].position = newPosition;
    cu.position            = basePosition;
    this.saveCUPosition(cu);
    this.saveCUPosition(selectedCCU[0]);
  };

  saveCUPosition = (cu) => {
    this.saveProperties(cu.content_unit_id, { position: cu.position, name: cu.name });
  };

  saveProperties = (ccuId, properties) => {
    const { collection, updateItemUnitProperties } = this.props;
    updateItemUnitProperties(collection.id, ccuId, properties);
  };

  handleSelectionChange = (cu, checked) => {
    const selectedCCU = this.state.selectedCCU;
    if (checked) {
      this.setState({ selectedCCU: [...selectedCCU, cu] });
    } else {
      this.setState({ selectedCCU: selectedCCU.filter(x => x.content_unit_id !== cu.content_unit_id) });
    }
  };

  deleteCollectionUnits = () => {
    const { selectedCCU }                 = this.state;
    const { collection, deleteItemUnit } = this.props;
    selectedCCU.forEach(cu => deleteItemUnit(collection.id, cu.content_unit_id));
  };

  render() {
    const { selectedCCU }         = this.state;
    const { units, setEditMode } = this.props;
    const isLast                 = selectedCCU.length === 0 ||
      selectedCCU[selectedCCU.length - 1].content_unit_id === units[units.length - 1].content_unit_id;
    const isFirst                = selectedCCU.length === 0 ||
      selectedCCU[0].content_unit_id === units[0].content_unit_id;


    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Associated Content Units" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item  onClick={() => setEditMode(true)}>
              <Icon name="plus" /> New Association
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div>
          <Sticky className={'stickyMenu'}>
            <Button.Group>
              <Button
                basic
                icon="arrow up"
                color="black"
                disabled={isFirst || selectedCCU.length > 1}
                onClick={() => this.updatePosition(true)}
              />
              <Button
                basic
                icon="arrow down"
                disabled={isLast || selectedCCU.length > 1}
                color="black"
                onClick={() => this.updatePosition(false)}
              />
              <Button
                basic
                icon="trash"
                color="black"
                disabled={selectedCCU.length === 0}
                onClick={this.deleteCollectionUnits}
              />
            </Button.Group>
          </Sticky>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <Units
                  {...this.props}
                  selectedCCU={selectedCCU}
                  onSelectionChange={this.handleSelectionChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    errDeleteCu: selectors.getError(state.collections, 'deleteItemUnit'),
    errUpdateCu: selectors.getError(state.collections, 'updateItemUnitProperties'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    updateItemUnitProperties: actions.updateItemUnitProperties,
    deleteItemUnit: actions.deleteItemUnit,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsContainer);