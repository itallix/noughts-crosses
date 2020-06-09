import {eventChannel} from 'redux-saga';
import {all, call, put, take, takeLatest} from 'redux-saga/effects';
import {connectToGame, createNewGame, getGameState, listGameSessions, makeTurn} from '../app.service';
import {boardLoaded, dashboardLoaded, dashboardSync, gameConnect, gameCreate, gameList, gameSession, gameSessionSync, gameTurnRequested} from "./actions";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {push} from 'connected-react-router';

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

export function* create({payload: {username, threshold, symbol}}) {
    console.log(`Creating new game with owner=${username} and threshold=${threshold}`);
    try {
        const {gameId, ownerId} = yield call(createNewGame, username, threshold);
        yield put(gameCreate.succeeded({gameId, ownerId, ownerName: username}));
        yield put(push(`/${gameId}/${ownerId}`));
        yield call(connectSession, { payload: { gameId } });
        console.log(`Successfully created new game with id=${gameId} and ownerId=${ownerId}`);
    } catch (e) {
        console.warn('Failed to create new game', e);
        yield put(gameCreate.failed());
    }
}

export function* connect({payload: {gameId, username}}) {
    try {
        const opponentId = yield call(connectToGame, gameId, username);
        yield put(gameConnect.succeeded({gameId, opponentId, opponentName: username}));
        yield put(push(`/${gameId}/${opponentId}`));
        yield call(connectSession, { payload: { gameId } });
        console.log(`Successfully connected to the game with id=${gameId} as ${username}`);
    } catch (e) {
        console.warn(`Failed to connect to the game with id = ${gameId} `, e);
        yield put(gameConnect.failed());
    }
}

export function* turn({payload: {gameId, playerId, row, col}}) {
    try {
        yield call(makeTurn, gameId, playerId, row, col);
    } catch (e) {
        console.warn(`Cannot process turn for game with id = ${gameId} `, e);
        yield put(gameConnect.failed());
    }
}

export function* get({payload: {gameId, playerId}}) {
    try {
        const gameState = yield call(getGameState, gameId, playerId);
        yield put(gameSession.succeeded(gameState));
        console.log(`Successfully loaded game state of the session with id=${gameId}`, gameState);
    } catch (e) {
        console.warn(`Cannot get game state with gameId = ${gameId} and playerId = ${playerId}`, e);
        yield put(gameSession.failed());
    }
}

export function* connectDashboard() {
    if (sessionSubscription !== null) {
        sessionSubscription.unsubscribe();
    }
    yield call(wsDashboardSaga);
}

export function* connectSession({payload: { gameId }}) {
    if (dashboardSubscription !== null) {
        dashboardSubscription.unsubscribe();
    }
    yield call(wsSessionSaga, gameId);
}

export default function* listSaga() {
    yield all([
        takeLatest([gameList.requested], list),
        takeLatest([gameCreate.requested], create),
        takeLatest([gameConnect.requested], connect),
        takeLatest([gameTurnRequested], turn),
        takeLatest([gameSession.requested], get),
        takeLatest([dashboardLoaded], connectDashboard),
        takeLatest([boardLoaded], connectSession)
    ]);
}

let stompClient = null;
let dashboardSubscription = null;
let sessionSubscription = null;

function initSessionWs(gameId) {
    return eventChannel(emitter => {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, frame => {
            console.log('Connected: ' + frame);
            sessionSubscription = stompClient.subscribe(`/topic/${gameId}`, e => {
                const body = e.body;
                if (body) {
                    return emitter(gameSessionSync(JSON.parse(body)));
                }
            });
        });
        return () => {
            console.log('Session disconnected');
        }
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
            dashboardSubscription = stompClient.subscribe('/topic/games', e => {
                const body = e.body;
                if (body) {
                    return emitter(dashboardSync(JSON.parse(body)));
                }
            });
        });
        return () => {
            console.log('Dashboard disconnected');
        }
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
