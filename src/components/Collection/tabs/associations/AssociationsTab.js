import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Menu, Icon, Header, Button } from 'semantic-ui-react';

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

  updatePriority(dir) {
    const { selectedCUIndex, units } = this.props;
    let currentCU = Object.assign({}, units[selectedCUIndex]);
    let nextCU = Object.assign({}, units[selectedCUIndex + dir]);
    const nextCUId = nextCU.cuId;
    nextCU.cuId = currentCU.cuId;
    currentCU.cuId = nextCUId;

    this.saveCUPriority(currentCU);
    this.saveCUPriority(nextCU);
  }

  saveCUPriority(contentUnit) {
    const { collection } = this.props;
    this.props.updateItemUnitProperties(collection.id, contentUnit.id, { cuId: contentUnit.cuId });
  }

  setSelectCUIndex(index) {
    this.setState({ selectedCUIndex: index });
  }

  render() {
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
          <Button icon="arrow up" basic color="black" onClick={() => this.updatePriority(1)} />
          <Button icon="arrow down" basic color="black" onClick={() => this.updatePriority(-1)} />
          <Button icon="trash" basic color="black" />
        </Button.Group>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <Units {this.selectCUIndex} {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const { collection = EMPTY_OBJECT } = ownProps;
  const unitIDs = collection.content_units;
  const denormCCUs = units.denormCCUs(state.content_units);

  return {
    units: unitIDs ? denormCCUs(unitIDs) : EMPTY_ARRAY,
    wip: selectors.getWIP(state.collections, 'fetchItemUnits'),
    err: selectors.getError(state.collections, 'fetchItemUnits'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchItemUnits: actions.fetchItemUnits,
    updateItemUnitProperties: actions.updateItemUnitProperties,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(AssociationsTab);