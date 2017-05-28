import {combineReducers} from "redux";
import {routerReducer as router} from "react-router-redux";
import search from "./modules/search";
import {reducer as tags} from "./modules/tags";
import {reducer as files} from "./modules/files";

export default combineReducers({
    router,
    search,
    tags,
    files
});

