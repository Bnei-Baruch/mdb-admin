import axios from "axios";

const API_BACKEND = process.env.NODE_ENV !== 'production' ?
    process.env.REACT_APP_MDB_URL :
    'http://app.mdb.bbdomain.org/';

const client = axios.create({baseURL: API_BACKEND});

export default client;