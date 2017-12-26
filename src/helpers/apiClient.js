import axios from 'axios';
import qs from 'qs';

import { API_BACKEND } from './env';

const client = axios.create({
  baseURL: API_BACKEND,
  paramsSerializer(params) {
    return qs.stringify(params, { indices: false });
  },
});

export default client;
