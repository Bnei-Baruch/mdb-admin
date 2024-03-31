import React from 'react';
import { Header, Grid, Menu, Dropdown } from 'semantic-ui-react';
import userManager from './InitKeycloak';
import { LANGUAGE_OPTIONS, SITE_LANGUAGES } from '../../helpers/consts';
import { AUTH_URL } from '../../helpers/env';

const ForbiddenPage = ({ user, updateCurrentLanguage, currentLanguage }) => {
  const changeLanguage = (e, { value }) => {
    updateCurrentLanguage(value);
  };

  const handleSignout = (e) => {
    e.preventDefault();
    userManager.signoutRedirect();
  };

  const options  = LANGUAGE_OPTIONS.filter(x => SITE_LANGUAGES.includes(x.value) && currentLanguage !== x.value);
  const selected = LANGUAGE_OPTIONS.find(x => currentLanguage === x.value);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Menu pointing>
            <Menu.Menu position="right">
              <Menu.Item>
                <Dropdown item text={user.name}>
                  <Dropdown.Menu>
                    <Dropdown.Item as="a" href={`${AUTH_URL}/account`} target="_blank">
                      My Account
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Header
            content="You Have No Access To This Content"
            size="medium"
            color="blue"
            textAlign="center"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ForbiddenPage;
