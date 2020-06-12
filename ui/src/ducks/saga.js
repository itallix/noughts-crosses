import {all, call, put, takeLatest} from 'redux-saga/effects';
import {connectToGame, createNewGame, getGameState, getGameStatus, listGameSessions, makeTurn} from '../app.service';
import {boardLoaded, dashboardLoaded, gameConnect, gameCreate, gameList, gameSession, gameStatus, gameTurnRequested} from "./actions";
import {push} from 'connected-react-router';
import {connectDashboard, connectSession} from "./ws-saga";

export function* list() {
    try {
        const sessions = yield call(listGameSessions);
        yield put(gameList.succeeded(sessions));
        console.log('Successfully loaded list of the games', sessions);
    } catch (e) {
        console.warn('Failed to load list of the games', e);
        yield put(gameList.failed({msg: e.response.data, status: e.response.status}));
    }
}

export function* create({payload: {gameName, username, threshold, symbol}}) {
    console.log(`Creating new game [${gameName}] with owner=${username} and threshold=${threshold}`);
    try {
        const {gameId, ownerId} = yield call(createNewGame, gameName, username, threshold, symbol);
        yield put(gameCreate.succeeded({ownerName: username, x: symbol}));
        yield put(push(`/${gameId}/${ownerId}`));
        yield call(connectSession, {payload: {gameId}});
        console.log(`Successfully created new game with id=${gameId} and ownerId=${ownerId}`);
    } catch (e) {
        console.warn('Failed to create new game', e.response);
        yield put(gameCreate.failed({msg: e.response.data, status: e.response.status}));
    }
}

export function* connect({payload: {gameId, username}}) {
    try {
        const { opponentId, x } = yield call(connectToGame, gameId, username);
        yield put(gameConnect.succeeded({opponentName: username, x}));
        yield put(push(`/${gameId}/${opponentId}`));
        yield call(connectSession, { payload: { gameId } });
        console.log(`Successfully connected to the game with id=${gameId} as ${username}`);
    } catch (e) {
        console.warn(`Failed to connect to the game with id = ${gameId} `, e);
        yield put(gameConnect.failed({msg: e.response.data, status: e.response.status}));
    }
}

export function* turn({payload: {gameId, playerId, row, col}}) {
    try {
        yield call(makeTurn, gameId, playerId, row, col);
    } catch (e) {
        console.warn(`Cannot process turn for game with id = ${gameId} `, e);
        yield put(gameConnect.failed({msg: e.response.data, status: e.response.status}));
    }
}

export function* get({payload: {gameId, playerId}}) {
    try {
        const gameState = yield call(getGameState, gameId, playerId);
        yield put(gameSession.succeeded(gameState));
        console.log(`Successfully loaded game state of the session with id=${gameId}`, gameState);
    } catch (e) {
        console.warn(`Cannot get game state with gameId = ${gameId} and playerId = ${playerId}`, e);
        yield put(gameSession.failed({msg: e.response.data, status: e.response.status}));
    }
}

export function* status({payload: {gameId}}) {
    try {
        const status = yield call(getGameStatus, gameId);
        yield put(gameStatus.succeeded(status));
        console.log(`Successfully loaded game status of the session with id=${gameId}`);
    } catch (e) {
        console.warn(`Cannot get game status with gameId = ${gameId}`, e);
        yield put(gameStatus.failed({msg: e.response.data, status: e.response.status}));
    }
}

export default function* listSaga() {
    yield all([
        takeLatest([gameList.requested], list),
        takeLatest([gameCreate.requested], create),
        takeLatest([gameConnect.requested], connect),
        takeLatest([gameTurnRequested], turn),
        takeLatest([gameSession.requested], get),
        takeLatest([dashboardLoaded], connectDashboard),
        takeLatest([boardLoaded], connectSession),
        takeLatest([gameStatus.requested], status)
    ]);
}
