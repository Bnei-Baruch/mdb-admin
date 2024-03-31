import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Image, Segment } from 'semantic-ui-react';
import logo from './KL_Tree_128.png';
import { actions } from '../../redux/modules/user';

const LoginPage = () => {
  const dispatch    = useDispatch();
  const handleLogin = () => {
    dispatch(actions.login());
  };

  return (
    <div className="login-form">
      <Segment raised padded="very" color="blue" textAlign="center">
        <Image src={logo} centered />
        <h3>Welcome to BB Archive admin app!</h3>
        <p>Please log in to continue</p>
        <Button primary size="huge" onClick={handleLogin}>Login</Button>
      </Segment>
    </div>
  );
};

export default LoginPage;
