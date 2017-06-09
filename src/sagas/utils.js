import { call } from 'redux-saga/effects';
import api from '../helpers/apiClient';

export function* loadAllPages(path, pageSize = 1000) {
  let actualPath = path;
  actualPath += path.indexOf('?') >= 0 ? '&' : '?';

  let page  = 1;
  let items = [];
  while (true) {
    const resp            = yield call(api.get, `${actualPath}page_size=${pageSize}&page_no=${page}`);
    const { total, data } = resp.data;

    items = items.concat(data);
    if (items.length < total) {
      page++;
    } else {
      break;
    }
  }

  return items;
}
