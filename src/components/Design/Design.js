import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';

const renderInGrid = content => (
  <Grid container>
    {
      content.map((x, i) => (
        <Grid.Row key={i}>
          <Grid.Column width={16}>
            {x}
          </Grid.Column>
        </Grid.Row>
      ))
    }
  </Grid>
);

const ItemDetails = () => (
  <div>
    <Header as="h2">
      <Icon name="settings" />
      <Header.Content>
        Account Settings
        <Header.Subheader>
          Manage your preferences
        </Header.Subheader>
      </Header.Content>
    </Header>
    <div style={{ paddingLeft: '25px' }}>
      <Header as="h4">
        <Icon name="settings" />
        <Header.Content>
          Account Settings
          <Header.Subheader>
            Manage your preferences
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Header as="h4" style={{ backgroundColor: '#00b5ad' }}>
        <Icon name="settings" />
        <Header.Content>
          Account Settings
          <Header.Subheader>
            Manage your preferences
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Header as="h4">
        <Icon name="settings" />
        <Header.Content>
          Account Settings
          <Header.Subheader>
            Manage your preferences
          </Header.Subheader>
        </Header.Content>
      </Header>
    </div>
  </div>
);

const Design = () => {
  // const contents = [
  //   <Header as="h2" content="Menu" />,
  //   <Player playerId="design" file="http://files.kabbalahmedia.info/files/heb_o_norav_2017-05-21_lesson_achana_n1_p0.mp4" />
  // ];

  const contents = [
    ItemDetails(),
    ItemDetails(),
    ItemDetails(),
    ItemDetails(),
  ];

  // return renderInGrid(contents);
  return renderInGrid(contents);
};

export default Design;
