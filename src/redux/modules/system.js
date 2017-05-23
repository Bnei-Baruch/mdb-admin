import {createAction} from "redux-actions";

/* Types */

const BOOT = 'System/BOOT';
const INIT = 'System/INIT';
const READY = 'System/READY';

export const types = {
    BOOT,
    INIT,
    READY
};

/* Actions */

const boot = createAction(BOOT);
const init = createAction(INIT);
const ready = createAction(READY);

export const actions = {
    boot,
    init,
    ready
};

/* Reducer */

export const reducer = (state, action) => state;

/* Selectors */

export const selectors = {};
