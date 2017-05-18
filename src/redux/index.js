import { combineReducers } from 'redux';
import search  from './modules/search';
import {reducer as tags}  from './modules/tags';

export default combineReducers({
    search,
    tags
});

