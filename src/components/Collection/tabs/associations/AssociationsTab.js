import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Menu, Icon, Header, Button, Sticky } from 'semantic-ui-react';
import orderBy from 'lodash/orderBy';

import * as shapes from '../../../shapes';
import { actions, selectors } from '../../../../redux/modules/collections';
import { selectors as units } from '../../../../redux/modules/content_units';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import Units from './Units';
import NewAssociations from './NewAssociations';
import './style.css';

class AssociationsTab extends Component {

  static propTypes = {
    updateItemUnitProperties: PropTypes.func.isRequired,
    fetchItemUnits: PropTypes.func.isRequired,
    collection: shapes.Collection,
  };

  static defaultProps = {
    collection: null,
  };

  state = {
    selectedCU: [],
  };

  constructor(props) {
    super(props);
    this.selectCU = this.selectCU.bind(this);
  }

  componentDidMount() {
    const { collection } = this.props;
    if (collection) {
      this.askForData(collection.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collection && !this.props.collection && nextProps.collection.id !== this.props.collection.id) {
      this.askForData(nextProps.collection.id);
    }
  }

  askForData(id) {
    this.props.fetchItemUnits(id);
  }

  updatePosition(isUp) {
    const { units }      = this.props;
    const { selectedCU } = this.state;
    let _basePosition    = selectedCU[0].position;
    let currentIndex     = units.findIndex(cu => selectedCU[0].content_unit_id === cu.content_unit_id);

    let cuIndex            = isUp ? currentIndex - 1 : currentIndex + 1;
    let _cu                = units[cuIndex];
    let _newPosition       = (_basePosition === _cu.position) ? (isUp ? _basePosition + 1 : _basePosition - 1) : _cu.position;
    selectedCU[0].position = _newPosition;
    _cu.position           = _basePosition;
    this.saveCUPosition(_cu);
    this.saveCUPosition(selectedCU[0]);
  }

  saveCUPosition(cu) {
    this.saveProperties(cu.content_unit_id, { position: cu.position, name: cu.name });
  }

  saveProperties(cuId, properties) {
    const { collection, updateItemUnitProperties } = this.props;
    updateItemUnitProperties(collection.id, cuId, properties);

  }

  selectCU(data, checked) {
    let selectedCU = this.state.selectedCU;
    const cu       = data;
    if (checked) {
      selectedCU.push(cu);
    } else {
      selectedCU.some((cu, i) => {
        if (cu.content_unit_id === data.content_unit_id) {
          selectedCU.splice(i, 1);
          return true;
        }
      });
    }
    this.setState({ selectedCU });
  }

  deleteCollectionUnits() {
    const { selectedCU }                 = this.state;
    const { collection, deleteItemUnit } = this.props;
    selectedCU.forEach((cu) => deleteItemUnit(collection.id, cu.content_unit_id));
  }

  render() {
    const { selectedCU, editMode } = this.state;
    const { units }                = this.props;
    let isLast                     = selectedCU.length === 0 || selectedCU[selectedCU.length - 1].content_unit_id === units[units.length - 1].content_unit_id;
    let isFirst                    = selectedCU.length === 0 || selectedCU[0].content_unit_id === units[0].content_unit_id;

    return (<div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Associated Content Units" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={() => this.setState({ editMode: false })}>
              <Icon name="plus" /> New Association
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div ref={this.handleContextRef}>
          <Sticky className={'stickyMenu'}>

            <Button.Group>
              <Button icon="arrow up"
                      basic
                      color="black"
                      disabled={isFirst || selectedCU.length > 1}
                      onClick={() => this.updatePosition(true)} />
              <Button icon="arrow down"
                      disabled={isLast || selectedCU.length > 1}
                      basic color="black"
                      onClick={() => this.updatePosition()} />
              <Button icon="trash" basic color="black"
                      disabled={selectedCU.length === 0}
                      onClick={() => {
                        this.deleteCollectionUnits();
                      }} />

            </Button.Group>
          </Sticky>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <Units
                  {...this.props}
                  selectCU={this.selectCU}
                  selectedCU={selectedCU} />

              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { collection = EMPTY_OBJECT } = ownProps;
  const unitIDs                       = collection.content_units;
  const denormCCUs                    = units.denormCCUs(state.content_units);

  return {
    units: unitIDs ? orderBy(denormCCUs(unitIDs), 'position', 'desc') : EMPTY_ARRAY,
    wip: selectors.getWIP(state.collections, 'fetchItemUnits'),
    err: selectors.getError(state.collections, 'fetchItemUnits'),
    errDeleteCu: selectors.getError(state.collections, 'deleteItemUnit'),
    errUpdateCu: selectors.getError(state.collections, 'updateItemUnitProperties'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItemUnits: actions.fetchItemUnits,
    updateItemUnitProperties: actions.updateItemUnitProperties,
    deleteItemUnit: actions.deleteItemUnit,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsTab);