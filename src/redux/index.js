import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import search from './modules/search';
import {reducer as tags} from './modules/tags';
import {reducer as sources} from './modules/sources';
import {reducer as system} from './modules/system';
import {reducer as files} from './modules/files';
import {reducer as collections} from './modules/collections';
import {reducer as content_units} from './modules/content_units';

export default combineReducers({
    router,
    system,
    search,
    tags,
    sources,
    files,
    collections,
    content_units,
});

