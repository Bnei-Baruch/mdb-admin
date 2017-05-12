import axios from "axios";
import qs from "qs";

const API_BACKEND = process.env.NODE_ENV !== 'production' ?
    process.env.REACT_APP_MDB_URL :
    'http://app.mdb.bbdomain.org/';

const client = axios.create({
    baseURL: API_BACKEND,
    paramsSerializer: function(params) {
        return qs.stringify(params, {indices: false})
    },
});

export default client;
