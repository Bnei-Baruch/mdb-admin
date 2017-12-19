import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginPage from './LoginPage';
import LoginCallback from './LoginCallback';

const Routes = () => (
  <Switch>
    <Route exact path="/callback" component={LoginCallback} />
    <Route component={LoginPage} />
  </Switch>
);

export default Routes;
