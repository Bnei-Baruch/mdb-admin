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
    selectedCU: []
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
    const { selectedCU } = this.state;
    const basePosition   = selectedCU[0].position;
    const currentIndex   = units.findIndex(cu => selectedCU[0].content_unit_id === cu.content_unit_id);
    const cuIndex        = currentIndex + (isUp ? -1 : 1);
    const cu             = units[cuIndex];

    let newPosition = cu.position;
    if (basePosition === cu.position) {
      newPosition = isUp ? basePosition + 1 : basePosition - 1;
    }

    selectedCU[0].position = newPosition;
    cu.position            = basePosition;
    this.saveCUPosition(cu);
    this.saveCUPosition(selectedCU[0]);
  };

  saveCUPosition = (cu) => {
    this.saveProperties(cu.content_unit_id, { position: cu.position, name: cu.name });
  };

  saveProperties = (cuId, properties) => {
    const { collection, updateItemUnitProperties } = this.props;
    updateItemUnitProperties(collection.id, cuId, properties);
  };

  handleSelectionChange = (cu, checked) => {
    const selectedCU = this.state.selectedCU;
    if (checked) {
      this.setState({ selectedCU: [...selectedCU, cu] });
    } else {
      this.setState({ selectedCU: selectedCU.filter(x => x.content_unit_id !== cu.content_unit_id) });
    }
  };

  deleteCollectionUnits = () => {
    const { selectedCU }                 = this.state;
    const { collection, deleteItemUnit } = this.props;
    selectedCU.forEach(cu => deleteItemUnit(collection.id, cu.content_unit_id));
  };

  render() {
    const { selectedCU }         = this.state;
    const { units, setEditMode } = this.props;
    const isLast                 = selectedCU.length === 0 ||
      selectedCU[selectedCU.length - 1].content_unit_id === units[units.length - 1].content_unit_id;
    const isFirst                = selectedCU.length === 0 ||
      selectedCU[0].content_unit_id === units[0].content_unit_id;


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
                disabled={isFirst || selectedCU.length > 1}
                onClick={() => this.updatePosition(true)}
              />
              <Button
                basic
                icon="arrow down"
                disabled={isLast || selectedCU.length > 1}
                color="black"
                onClick={() => this.updatePosition(false)}
              />
              <Button
                basic
                icon="trash"
                color="black"
                disabled={selectedCU.length === 0}
                onClick={this.deleteCollectionUnits}
              />
            </Button.Group>
          </Sticky>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <Units
                  {...this.props}
                  selectedCU={selectedCU}
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