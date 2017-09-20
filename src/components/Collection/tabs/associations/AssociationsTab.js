import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Menu, Icon, Header, Button } from 'semantic-ui-react';
import orderBy from 'lodash/orderBy';

import * as shapes from '../../../shapes';
import { actions, selectors } from '../../../../redux/modules/collections';
import { selectors as units } from '../../../../redux/modules/content_units';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../../helpers/consts';
import Units from './Units';

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
    selectedCU: []
  };

  constructor(props) {
    super(props);
    this.selectCUIndex = this.selectCUIndex.bind(this);
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

    let cuIndex            = isUp ? selectedCU[0].index - 1 : selectedCU[0].index + 1;
    let _cu                = units[cuIndex];
    let _newPosition       = (_basePosition === _cu.position) ? (isUp ? _basePosition++ : _basePosition--) : _cu.position;
    selectedCU[0].position = _newPosition;
    _cu.position           = _basePosition;
    this.saveCUPosition(_cu);
    this.saveCUPosition(selectedCU[0]);

    /*let grouped          = this.groupPermanent(selectedCU);
     grouped.forEach((g) => {
     if (g.length === 0) {
     return;
     }
     //get index of item that must to move
     let cuIndex = !isUp ? g[g.length - 1].index + 1 : g[0].index - 1;
     let _cu     = units[cuIndex];
     const _basePosition = _cu.position;

     _cu.position = !isUp ? g[0].position : g[g.length - 1].position;
     this.saveCUPosition(_cu);
     g.forEach((cu, i, arr) => {
     cu.position = isUp ? _basePosition + i : _basePosition - (arr.length - i);
     this.saveCUPosition(cu);
     });
     });*/
  }

  groupPermanent(data) {
    return data.reduce((result, cu, i, arr) => {
      cu.index === arr[i + 1] ? result[0].push(cu) : result.unshift([cu]);
      return result;
    }, [[]]);
  }

  saveCUPosition(contentUnit) {
    const { collection } = this.props;
    this.props.updateItemUnitProperties(collection.id, contentUnit.content_unit_id, { position: contentUnit.position });
  }

  selectCUIndex(index, data, checked) {
    let selectedCU = this.state.selectedCU;
    const cu       = data;
    cu.index       = index;
    if (checked) {
      selectedCU.push(cu);
    } else {
      selectedCU.some((cu, i, arr) => {
        if (cu.content_unit_id === data.content_unit_id) {
          return arr.splice(i, 1);
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
    const selectedCU = this.state.selectedCU;
    const { units }  = this.props;
    let isLast       = selectedCU.length === 0 || selectedCU[selectedCU.length - 1].index >= units[units.length - 1].index;
    let isFirst      = selectedCU.length === 0 || selectedCU[0].index <= units[0].index;

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

        <Button.Group>
          <Button icon="arrow up"
                  basic
                  color="black"
                  disabled={isFirst}
                  onClick={() => this.updatePosition(true)} />
          <Button icon="arrow down"
                  disabled={isLast}
                  basic color="black"
                  onClick={() => this.updatePosition()} />
          <Button icon="trash" basic color="black"
                  disabled={selectedCU.length === 0}
                  onClick={() => {
                    this.deleteCollectionUnits();
                  }} />
        </Button.Group>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column>
              <Units
                selectCUIndex={this.selectCUIndex}
                selectedCU={selectedCU}
                {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
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