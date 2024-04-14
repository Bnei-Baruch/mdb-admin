import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../../redux/modules/user';
import { getKeycloak, onceInitKC } from './helper';

const InitKeycloak = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    onceInitKC(dispatch);
  }, [dispatch]);

  getKeycloak().onTokenExpired = () => {
    renewRetry(0);
  };

  const renewRetry = (retry) => {
    if (retry > 5) {
      getKeycloak().clearToken();
      dispatch(actions.clearUser());
    } else {
      setTimeout(() => renewToken(retry), 10000);
    }
  };
  const renewToken = retry => {
    getKeycloak().updateToken(70).then(refreshed => {
      if (refreshed) {
        dispatch(actions.setToken(getKeycloak().token));
      } else {
        renewRetry(retry + 1, refreshed);
      }
    }).catch(err => {
      renewRetry(retry + 1, err);
    });
  };

  return null;
};

export default InitKeycloak;
