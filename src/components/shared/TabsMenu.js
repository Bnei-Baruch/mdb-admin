import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../helpers/consts';

class TabsMenu extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      element: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    })),
    active: PropTypes.string,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
    active: '',
  };

  constructor(props) {
    super(props);

    let { active } = props;
    if (!active) {
      const { items } = props;
      if (items.length > 0) {
        active = items[0].name;
      }
    }

    this.state = { active };
  }

  componentWillReceiveProps(nextProps) {
    const { active } = nextProps;
    if (active !== this.props.active) {
      this.setState({ active });
    }
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
        {(<ElementType {...this.props} />)}
      </div>
    );
  }
}

export default TabsMenu;
