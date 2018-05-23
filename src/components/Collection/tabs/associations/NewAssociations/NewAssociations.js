import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Segment } from 'semantic-ui-react';

import { NS_COLLECTION_UNITS, CONTENT_UNIT_TYPES } from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import ListWithFiltersBase from '../../../../BaseClasses/ListWithFiltersBase';
import ContentUnitList from './NewAssociationsList';

class NewAssociations extends ListWithFiltersBase {
  constructor(props) {
    super(props);
    NewAssociations.propTypes = {
      ...super.propTypes,
      items: PropTypes.arrayOf(shapes.ContentUnit),
      associate: PropTypes.func.isRequired,
      setEditMode: PropTypes.func.isRequired,
    };
  }

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics'];

  getNamespace = () => NS_COLLECTION_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    return <ContentUnitList {...this.props} />;
  };

  handleViewMode = () =>
    this.props.setEditMode(false);

  render() {


    return (
      <div>
        <Segment clearing secondary size="large">
          <div>
            Associate content units to this collection
            <Button
              onClick={this.handleViewMode}
              floated="right"
              icon="close"
              content="Cancel"
            />
          </div>
        </Segment>

        <Segment clearing vertical>
          <Button
            onClick={this.props.associate}
            floated="right"
            content="Associate content units to this collection"
            color="blue"
          />
          <Button
            onClick={this.toggleFilters}
            color="blue"
            floated="right"
            inverted
          >
            <Icon name="filter" />
            {this.state.showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </Segment>

        {this.renderFiltersHydrator()}
        {this.renderContent()}
      </div>
    );
  }
}

export default NewAssociations;
