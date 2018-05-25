import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Segment } from 'semantic-ui-react';

import { NS_FILE_UNITS, CONTENT_UNIT_TYPES } from '../../../../helpers/consts';
import * as shapes from '../../../shapes';
import ContentUnitList from './NewAssociationsList';
import ListWithFiltersBase from '../../../BaseClasses/ListWithFiltersBase';

class FileContentUnit extends ListWithFiltersBase {

  constructor(props) {
    super(props);
    FileContentUnit.propTypes = {
      ...super.propTypes,
      file: shapes.File,
    };
  };

  usedFiltersNames = ['FreeText', 'DateRange', 'Sources', 'Topics', 'Others'];

  getNamespace = () => NS_FILE_UNITS;

  getContentType = () => CONTENT_UNIT_TYPES;

  renderList = () => {
    const { currentLanguage, items, file } = this.props;
    return (<ContentUnitList
      associatedCUId={file.content_unit_id}
      items={items}
      handleSelectCU={this.handleSelectCU}
      selectedCUId={this.state.selectedCUId}
      currentLanguage={currentLanguage} />);
  };

  toggleFilters = (isShow) => {
    const showFilters = isShow === undefined ? !this.state.showFilters : isShow;
    this.setState({ showFilters });
  };

  associate = () => {
    const { selectedCUId }           = this.state;
    const { file, updateProperties } = this.props;
    if (!selectedCUId) {
      return;
    }
    updateProperties(file.id, { content_unit_id: selectedCUId });
    this.handleSelectCU({});
  };

  render() {
    const { showFilters, selectedCUId } = this.state;
    const { file }                      = this.props;

    return (
      <div>
        <Segment clearing secondary size="large">
          <div>
            <Link to={`/content_units/${file.content_unit_id}`}>
              Content unit currently associated with this file. Id: {file.content_unit_id}.
            </Link>
          </div>
        </Segment>

        <Segment clearing vertical>
          <Button
            onClick={this.associate}
            disabled={!selectedCUId}
            floated="right"
            content="Associate content unit to this file"
            color="blue"
          />
          <Button
            onClick={this.toggleFilters}
            color="blue"
            floated="right"
            inverted
          >
            <Icon name="filter" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </Segment>

        {this.renderFiltersHydrator()}
        {this.renderContent()}
      </div>
    );
  }
}

export default FileContentUnit;
