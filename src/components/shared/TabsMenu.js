import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { EMPTY_ARRAY } from '../../helpers/consts';
import { selectors as filterSelectors } from '../../redux/modules/filters';

class TabsMenu extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      element: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]).isRequired,
      namespace: PropTypes.string,
    })),
    active: PropTypes.string,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
    active: '',
  };

  constructor(props) {
    super(props);
    const active = TabsMenu.activeFromProps(props);
    this.state   = { active };
  }

  static getDerivedStateFromProps(props, state) {
    const active = TabsMenu.activeFromProps(props);
    if (active !== state.active) {
      return { active: state.active ? state.active : active };
    }
    return null;
  }

  static activeFromProps(props) {

    if (props.active)
      return props.active;

    const { items } = props;
    if (items.length > 0) {
      return items[0].name;
    }
    return '';
  }

  handleActiveChange = (e, { name }) => this.setState({ active: name });

  render() {
    const { active } = this.state;
    const { items }  = this.props;

    const activeItem  = items.find(x => x.name === active);
    const ElementType = activeItem.element;

    return (
      <div>
        <Menu secondary pointing color="blue">
          {
            items.map((item) => {
              const { name } = item;
              return (
                <Menu.Item
                  key={name}
                  name={name}
                  active={active === name}
                  onClick={this.handleActiveChange}
                >
                  {name}
                </Menu.Item>
              );
            })
          }
        </Menu>
        {(
          <ElementType {...this.props} namespace={activeItem.namespace} contentTypes={activeItem.contentTypes} isUpdateQuery={activeItem.isUpdateQuery} />)}
      </div>
    );
  }
}

export default connect((state, ownProps) => {
  const filterName = filterSelectors.getActiveFilter(state.filters, ownProps.items[0].namespace);
  return {
    active: filterSelectors.getTabNameByFilterName(filterName)
  };
})(TabsMenu);

