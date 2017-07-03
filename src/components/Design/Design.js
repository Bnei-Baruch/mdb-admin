import React from 'react';
import { Grid } from 'semantic-ui-react';

import SourcesSearch from '../Autocomplete/SourcesSearch';

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

const Design = () => {
  // const contents = [
  //   <Header as="h2" content="Menu" />,
  //   <Player playerId="design" file="http://files.kabbalahmedia.info/files/heb_o_norav_2017-05-21_lesson_achana_n1_p0.mp4" />
  // ];

  const contents = [
    (<SourcesSearch onSelect={suggestion => console.log('selected', suggestion)} />),
  ];

  // return renderInGrid(contents);
  return renderInGrid(contents);
};

export default Design;
