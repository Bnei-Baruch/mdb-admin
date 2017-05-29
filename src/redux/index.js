import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import search from './modules/search';
import {reducer as tags} from './modules/tags';
import {reducer as system} from './modules/system';

export default combineReducers({
    router,
    system,
    search,
    tags
});

