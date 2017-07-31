import React from 'react';
import { Header, Menu, Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import UpdateCollectionPropertiesForm from '../../../shared/Forms/Collection/UpdateCollectionPropertiesForm';

const Properties = props => (
  <div>
    <Menu attached borderless size="large">
      <Menu.Item header>
        <Header content="Extra properties" size="medium" color="blue" />
      </Menu.Item>
    </Menu>
    <Segment attached>
      <UpdateCollectionPropertiesForm
        collection={props.collection}
        update={(id, properties) => console.log(id, properties)}
      />
    </Segment>
  </div>
);

Properties.propTypes = {
  collection: shapes.Collection,
};

Properties.defaultProps = {
  collection: null,
};

export default Properties;
