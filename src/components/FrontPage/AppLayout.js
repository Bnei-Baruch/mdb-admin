import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { Dropdown, Flag, Grid, Image, Menu } from 'semantic-ui-react';

import { AUTH_URL, } from '../../helpers/env';
import { LANGUAGE_OPTIONS, SITE_LANGUAGES } from '../../helpers/consts';
import userManager from '../../helpers/userManager';

import logo from './KL_Tree_32.png';

class AppLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.element,
    user: PropTypes.object.isRequired,
    updateCurrentLanguage: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  changeLanguage = (e, { value }) => {
    const { updateCurrentLanguage } = this.props;
    updateCurrentLanguage(value);
  };

  handleSignout = (e) => {
    e.preventDefault();
    userManager.signoutRedirect();
  };

  render() {
    const { user, currentLanguage, children } = this.props;

    const options  = LANGUAGE_OPTIONS.filter(x => SITE_LANGUAGES.includes(x.value) && currentLanguage !== x.value);
    const selected = LANGUAGE_OPTIONS.find(x => currentLanguage === x.value);
    return (
      <Grid>
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
              <Menu.Item key={9} as={NavLink} to="/publishers">Publishers</Menu.Item>
              <Menu.Item key={10} as={NavLink} to="/labels">Labels</Menu.Item>

              <Menu.Menu position="right">
                <Menu.Item>
                  <Dropdown
                    button
                    text={selected.text}
                    icon={<Flag name={selected.flag} style={{ margin: '3px 10px 0 0', float: 'left' }} />}
                    onChange={this.changeLanguage}
                    options={options}
                    selectOnBlur={false}
                  />
                </Menu.Item>
                <Menu.Item>
                  <Dropdown item text={user.profile.name}>
                    <Dropdown.Menu>
                      <Dropdown.Item as="a" href={`${AUTH_URL}/account`} target="_blank">
                        My Account
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={this.handleSignout}>Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            {children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default AppLayout;
