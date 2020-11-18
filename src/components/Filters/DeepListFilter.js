import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import {
  Button, Menu, Segment, Container
} from 'semantic-ui-react';

import { hierarchyToTree, hierarchyNodeToTreeNode, extractI18n } from '../../helpers/utils';
import connectFilter from './connectFilter';

const listToNumbersIfCan = (list) => {
  return list.map(x => (Number.isNaN(parseFloat(x)) ? x : parseFloat(x)));
};

class DeepListFilter extends React.Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    getSubItemById: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    emptyLabel: PropTypes.string.isRequired,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.any,
    allValues: PropTypes.any,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    roots: [],
    onCancel: noop,
    onApply: noop,
    value: [],
    allValues: [],
  };

  constructor(props) {
    super(props);
    this.state = { selection: listToNumbersIfCan(props.value) };
  }

  componentDidMount() {
    this.scrollToSelections(this.state.selection);
  }

  componentDidUpdate() {
    this.listContainer.scrollLeft = this.listContainer.scrollWidth;
    this.scrollToSelections(this.state.selection);
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    const depth     = data['data-depth'];

    const { selection: oldSelection } = this.state;
    const newSelection                = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(value);

    const menu          = this.menus[depth];
    const prevScrollTop = menu.scrollTop;
    this.setState({ selection: newSelection }, () => {
      this.menus[depth].scrollTop = prevScrollTop;
    });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  menus = {};

  apply = () => {
    const { updateValue, onApply, isUpdateQuery } = this.props;
    const { selection }                           = this.state;
    if (Array.isArray(selection) && selection.length === 0) {
      return;
    }
    updateValue(selection, isUpdateQuery);
    onApply();
  };

  canApply = () => this.state.selection && this.state.selection.length > 0;

  scrollToSelections = (selections) => {
    if (this.menus[0]) {
      selections.forEach((selection, depth) => {
        const selectedItems = this.menus[depth].getElementsByClassName('active');

        if (selectedItems.length) {
          const firstItem             = selectedItems[0];
          this.menus[depth].scrollTop = firstItem.offsetTop;
        }
      });
    }
  };

  // Return all lists of selected sources.
  createLists = (depth, items, selection, otherSelected) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    if (selection.length === 0) {
      return [this.createList(depth, items, '', otherSelected.map(s => s[0]))];
    }
    const { getSubItemById, hierarchy } = this.props;

    const selected = hierarchyNodeToTreeNode(hierarchy, getSubItemById(selection[0]));
    const current  = this.createList(depth, items, selection[0], otherSelected.map(s => s[0]));
    let next       = [];
    if (selected && selected.children) {
      next = this.createLists(depth + 1,
        selected.children,
        selection.slice(1),
        otherSelected.filter(s => s.length > 0).map(s => s.slice(1)));
    }

    return [current].concat(next);
  };

  createList = (depth, items, selectedId, otherSelectedIds) => {
    const { getSubItemById, hierarchy, currentLanguage } = this.props;

    return (
      <div key={selectedId} className="filter-steps__column-wrapper" ref={el => this.menus[depth] = el}>
        <div className="filter-steps__column">
          <Menu fluid vertical color="blue" size="tiny">
            {
              items.map(({ id }) => {
                const node  = hierarchyNodeToTreeNode(hierarchy, getSubItemById(id));
                const style = otherSelectedIds.includes(id) && selectedId !== id
                  ? { backgroundColor: 'lightgoldenrodyellow' }
                  : {};

                return (
                  <Menu.Item
                    key={id}
                    value={id}
                    active={selectedId === id}
                    data-depth={depth}
                    onClick={this.onSelectionChange}
                    style={style}
                  >
                    {extractI18n(node.i18n, ['name', 'label'], currentLanguage)}
                  </Menu.Item>
                );
              })
            }
          </Menu>
        </div>
      </div>
    );
  };

  render() {
    const { hierarchy, emptyLabel, allValues } = this.props;

    const roots = hierarchyToTree(hierarchy);
    return (
      <Container className="padded-horizontally" fluid>
        <Segment
          vertical
          className="tab active"
          style={{ padding: '0' }}
        >
          <div
            className="filter-steps"
            ref={el => this.listContainer = el}
          >
            {
              roots.length > 0
                ? this.createLists(0, roots, this.state.selection, listToNumbersIfCan(allValues))
                : emptyLabel
            }
          </div>
        </Segment>
        <Segment vertical clearing>
          <Button primary content="Apply" floated="left" disabled={!this.canApply()} onClick={this.apply} />
          <Button content="Close" floated="left" onClick={this.onCancel} />
        </Segment>
      </Container>
    );
  }
}

export default connectFilter()(DeepListFilter);
