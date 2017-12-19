import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Grid, Image, Menu } from 'semantic-ui-react';

import userManager from '../../helpers/userManager';

import logo from './KL_Tree_32.png';

class AppLayout extends PureComponent {

  static propTypes = {
    children: PropTypes.element
  };

  static defaultProps = {
    children: null,
  };

  handleSignout = (e) => {
    e.preventDefault();
    userManager.signoutRedirect();
  };

  render() {
    return (
      <Grid container>
        <Grid.Row>
          <Grid.Column>
            <Menu pointing>
              <Menu.Item as={Link} to="/">
                <Image spaced="right" src={logo} />
                <strong>BB Archive</strong>
              </Menu.Item>
              <Menu.Item key={2} as={NavLink} to="/collections">Collections</Menu.Item>
              <Menu.Item key={3} as={NavLink} to="/content_units">Content Units</Menu.Item>
              <Menu.Item key={4} as={NavLink} to="/files">Files</Menu.Item>
              <Menu.Item key={5} as={NavLink} to="/operations">Operations</Menu.Item>
              <Menu.Item key={6} as={NavLink} to="/tags">Tags</Menu.Item>
              <Menu.Item key={7} as={NavLink} to="/sources">Sources</Menu.Item>
              <Menu.Item key={8} as={NavLink} to="/persons">Persons</Menu.Item>

              <Menu.Menu position="right">
                <Menu.Item onClick={this.handleSignout}>Sign Out</Menu.Item>
              </Menu.Menu>
            </Menu>
            {this.props.children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default AppLayout;
