import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Image, Segment } from '../ui';
import logo from './KL_Tree_128.png';
import { actions } from '../../redux/modules/user';

const LoginPage = () => {
  const dispatch    = useDispatch();
  const handleLogin = () => {
    dispatch(actions.login());
  };

  return (
    <div className="login-form">
      <Segment raised padded="very" color="blue" textAlign="center" className="flex flex-col items-center gap-3">
        <Image src={logo} centered className="mb-2" />
        <h3>Welcome to BB Archive admin app!</h3>
        <p className="text-gray-600">Please log in to continue</p>
        <Button primary size="large" className="mt-2 px-8" onClick={handleLogin}>Login</Button>
      </Segment>
    </div>
  );
};

export default LoginPage;
