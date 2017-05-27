import { createAction } from 'redux-actions';
import { takeEvery } from 'redux-saga';
import { all, race, call } from 'redux-saga/effects';

const WAIT_FOR_ACTIONS_PROMISE = 'WAIT_FOR_ACTIONS_PROMISE';

export const waitAction = createAction(WAIT_FOR_ACTIONS_PROMISE);

function resolveOnActions(actions, dispatch, timeout) {
    return new Promise((resolve, reject) => {
        dispatch(waitAction({
            actions,
            defer: { resolve, reject },
            timeout
        }));
    });
}

export function* watchWaitForActions() {
    yield takeEvery(WAIT_FOR_ACTIONS_PROMISE, function* ({ payload }) {
        const { actions, defer, timeout } = payload;
        const { resolve, reject } = defer;

        const takeAll = all(actions.map(action => take(action)));

        let done = false;
        let timedout = false;
        if (timeout) {
            yield { done, timedout } = yield race({
                done: takeAll,
                timedout: delay(timeout)
            });
        } else {
            yield takeAll;
            done = true;
        }

        if (done) {
            yield call(resolve);
        } else {
            yield call(reject);
        }
    });
}
