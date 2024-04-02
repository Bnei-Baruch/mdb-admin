import { useEffect } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { actions as persons } from '../../redux/modules/persons';
import { actions as sources } from '../../redux/modules/sources';
import { actions as authors } from '../../redux/modules/authors';
import { selectors as user } from '../../redux/modules/user';

const InitialFetchAll = () => {
  const token    = useSelector(state => user.getToken(state.user));
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      batch(() => {
        dispatch(authors.fetchAll());
        dispatch(sources.fetchAll());
        dispatch(persons.fetchAll());

      });
    }
  }, [dispatch, token]);

  return null;
};

export default InitialFetchAll;
