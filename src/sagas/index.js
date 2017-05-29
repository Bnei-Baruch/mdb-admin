import {sagas as tagsSagas} from "./tags";
import {sagas as filesSagas} from "./files";
import {sagas as collectionsSagas} from "./collections";
import {sagas as contentUnitsSagas} from "./content_units";

export default [
    ...tagsSagas,
    ...filesSagas,
    ...collectionsSagas,
    ...contentUnitsSagas,
];
