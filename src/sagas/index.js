import {sagas as tagsSagas} from "./tags";
import watchWaitForAction from './waitForAction';

export default [
    watchWaitForAction,
    ...tagsSagas,
];
