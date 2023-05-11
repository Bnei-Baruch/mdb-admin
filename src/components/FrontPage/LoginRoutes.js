import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import LoginCallback from './LoginCallback';

const LoginRoutes = () => (
  <Routes>
    <Route exact path="/callback" component={LoginCallback} />
    <Route component={LoginPage} />
  </Routes>
);

export default LoginRoutes;
