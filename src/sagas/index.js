import {sagas as tagsSagas} from "./tags";
import {sagas as filesSagas} from "./files";

export default [
    ...tagsSagas,
    ...filesSagas,
];
