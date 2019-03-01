import axios from 'axios';
import qs from 'qs';
import getMock from '../mocks'

import { API_BACKEND, USE_MOCKS } from './env';

const client = axios.create({
  baseURL: API_BACKEND,
  paramsSerializer(params) {
    return qs.stringify(params, { indices: false });
  },
});

const mockClient = {
  get: (...args) => getMock('get', ...args) || client.get(...args),
  post: (...args) => getMock('post', ...args) || client.post(...args),
  put: (...args) => getMock('put', ...args) || client.put(...args),
  delete: (...args) => getMock('delete', ...args) || client.delete(...args) 
}

export default USE_MOCKS ? mockClient : client;
