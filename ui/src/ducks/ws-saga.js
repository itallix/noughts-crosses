import {eventChannel} from 'redux-saga';
import {call, put, take} from 'redux-saga/effects';
import {dashboardSync, gameSessionSync} from "./actions";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;
let dashboardSubscription = null;
let sessionSubscription = null;

const channel = (subscribe) => eventChannel(emitter => {
        if (stompClient !== null && stompClient.connected) {
            subscribe(emitter);
        } else {
            stompClient = Stomp.over(new SockJS('/ws'));
            stompClient.connect({}, () => subscribe(emitter));
        }

        return () => {
            console.log('Session disconnected');
        }
    });

function initSessionWs(gameId) {
    const subscribe = (emitter) => {
        sessionSubscription = stompClient.subscribe(`/topic/${gameId}`, e => {
            const body = e.body;
            if (body) {
                return emitter(gameSessionSync(JSON.parse(body)));
            }
        });
    };

    return channel(subscribe);
}

function initDashboardWs() {
    const subscribe = (emitter) => {
        dashboardSubscription = stompClient.subscribe('/topic/games', e => {
            const body = e.body;
            if (body) {
                return emitter(dashboardSync(JSON.parse(body)));
            }
        });
    }

    return channel(subscribe);
}

function* wsSessionSaga(gameId) {
    const channel = yield call(initSessionWs, gameId)
    while (true) {
        const action = yield take(channel)
        console.log('Action', action);
        yield put(action)
    }
}

function* wsDashboardSaga() {
    const channel = yield call(initDashboardWs)
    while (true) {
        const action = yield take(channel)
        console.log('Action', action);
        yield put(action)
    }
}

export function* connectDashboard() {
    if (sessionSubscription) {
        sessionSubscription.unsubscribe();
    }
    yield call(wsDashboardSaga);
}

export function* connectSession({payload: { gameId }}) {
    if (dashboardSubscription) {
        dashboardSubscription.unsubscribe();
    }
    yield call(wsSessionSaga, gameId);
}
