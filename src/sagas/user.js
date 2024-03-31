import { call, put, takeLatest } from 'redux-saga/effects';
import { types, actions } from '../redux/modules/user';
import { kcLogin } from '../components/FrontPage/helper';

function* login() {
  try {
    const resp = yield call(kcLogin);
    yield put(actions.setUser(resp.data));
  } catch (err) {
    yield put(actions.clearUser());
  }
}

function* watchLogin() {
  yield takeLatest([types.LOGIN], login);
}

export const sagas = [
  watchLogin,
];
