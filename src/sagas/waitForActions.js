import { createAction } from 'redux-actions';
import { delay } from 'redux-saga';
import { takeEvery, all, race, call, take } from 'redux-saga/effects';

const WAIT_FOR_ACTIONS_PROMISE = 'WAIT_FOR_ACTIONS_PROMISE';

const waitAction = createAction(WAIT_FOR_ACTIONS_PROMISE);

export function resolveOnActions(actions, dispatch, timeout) {
    return new Promise((resolve, reject) => {
        dispatch(waitAction({
            actions,
            defer: { resolve, reject },
            timeout
        }));
    });
}

export function* watchWaitForActions() {
    yield takeEvery(WAIT_FOR_ACTIONS_PROMISE, function* processWaitForActions({ payload }) {
        const { actions, defer, timeout } = payload;
        const { resolve, reject } = defer;

        if (!actions) {
            yield call(resolve);
            return;
        }

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
