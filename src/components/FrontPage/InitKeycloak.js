import { useEffect } from 'react';
import { useDispatch, batch } from 'react-redux';
import { actions } from '../../redux/modules/user';
import { getKeycloak } from './helper';

const options = {
  checkLoginIframe: false,
  flow            : 'standard',
  pkceMethod      : 'S256',
  enableLogging   : true,
  onLoad          : 'check-sso'
};

const InitKeycloak = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getKeycloak().init(options).then(ok => {
      if (!ok) {
        dispatch(actions.clearUser());
        return;
      }

      const { sub, name, realm_access } = getKeycloak().tokenParsed;
      batch(() => {
        dispatch(actions.setUser({ id: sub, name, realm_access }));
        dispatch(actions.setToken(getKeycloak().token));
      });
    }).catch(error => {
      console.error(error);
      dispatch(actions.clearUser());
    });
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
