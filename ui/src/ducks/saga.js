import {eventChannel} from 'redux-saga';
import {all, call, put, select, take, takeLatest} from 'redux-saga/effects';
import {listGameSessions, connectToGame, createNewGame, makeTurn, getGameState} from '../app.service';
import {gameList, gameSession, gameConnect, gameCreate, gameTurnRequested, updateDashboard, appLoaded} from "./actions";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export function* list() {
    try {
        const sessions = yield call(listGameSessions);
        yield put(gameList.succeeded(sessions));
        console.log('Successfully loaded list of the games', sessions);
    } catch (e) {
        console.warn('Failed to load list of the games', e);
        yield put(gameList.failed());
    }
}

export function* create({ payload: { username, threshold, symbol } }) {
    console.log(`Creating new game with owner=${username} and threshold=${threshold}`);
    try {
        const { gameId, ownerId } = yield call(createNewGame, username, threshold);
        yield put(gameCreate.succeeded({gameId, ownerId, ownerName: username}));
        yield call(wsSessionSaga, gameId);
        console.log(`Successfully created new game with id=${gameId} and ownerId=${ownerId}`);
    } catch (e) {
        console.warn('Failed to create new game', e);
        yield put(gameCreate.failed());
    }
}

export function* connect({ payload: { gameId, username }}) {
    try {
        const opponentId = yield call(connectToGame, gameId, username);
        yield put(gameConnect.succeeded({gameId, opponentId, opponentName: username}));
        yield call(wsSessionSaga, gameId);
        console.log(`Successfully connected to the game with id=${gameId} as ${username}`);
    } catch (e) {
        console.warn(`Failed to connect to the game with id = ${gameId} `, e);
        yield put(gameConnect.failed());
    }
}

const getGameSession = state => state.ticTacReducer.session;

export function* turn({payload: { row, col }}) {
    const { gameId, playerId } = yield select(getGameSession);
    try {
        yield call(makeTurn, gameId, playerId, row, col);
    } catch (e) {
        console.warn(`Cannot process turn for game with id = ${gameId} `, e);
        yield put(gameConnect.failed());
    }
}

export function* get() {
    const { gameId, playerId } = yield select(getGameSession);
    try {
        const gameState = yield call(getGameState, gameId, playerId);
        yield put(gameSession.succeeded(gameState));
    } catch (e) {
        console.warn(`Cannot get game state with id = ${gameId} and playerId = ${playerId}`, e);
    }
}

export default function* listSaga() {
    yield all([
        takeLatest([gameList.requested], list),
        takeLatest([gameCreate.requested], create),
        takeLatest([gameConnect.requested], connect),
        takeLatest([gameTurnRequested], turn),
        takeLatest([gameSession.requested], get),
        takeLatest([appLoaded], wsDashboardSaga)
    ]);
}

let stompClient = null;

function initSessionWs(gameId) {
    return eventChannel(emitter => {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, frame => {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/topic/${gameId}`, e => {
                const body = e.body;
                if (body) {
                    return emitter(gameSession.succeeded(JSON.parse(body)));
                }
            });
        });
        return () => { console.log('Session disconnected'); }
    })
}

function* wsSessionSaga(gameId) {
    const channel = yield call(initSessionWs, gameId)
    while (true) {
        const action = yield take(channel)
        console.log('Action', action);
        yield put(action)
    }
}

function initDashboardWs() {
    return eventChannel(emitter => {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, frame => {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/games', e => {
                const body = e.body;
                if (body) {
                    return emitter(updateDashboard(JSON.parse(body)));
                }
            });
        });
        return () => { console.log('Dashboard disconnected'); }
    })
}

function* wsDashboardSaga() {
    const channel = yield call(initDashboardWs)
    while (true) {
        const action = yield take(channel)
        console.log('Action', action);
        yield put(action)
    }
}
