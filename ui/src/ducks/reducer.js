import {handleActions} from 'redux-actions';

import {dashboardSync, gameConnect, gameCreate, gameList, gameSession, gameSessionSync, gameStatus} from "./actions";
import {GameStatuses, WaitStatuses} from "../app.types";

export const defaultState = {
    list: [],
    session: {
        board: Array(10).fill(0).map(() => Array(10).fill(0)),
        gameName: null,
        isOwner: false,
        lastTurn: null,
        playerName: null,
        shouldWait: false,
        status: null,
        threshold: 5,
        win: null,
        x: true
    },
    loading: false,
    error: {
        msg: null,
        status: null
    }
};

const noError = () => ({ msg: null, status: null });

const reducer = handleActions({
        [gameList.requested]: state => ({...state, loading: true}),
        [gameList.failed]: (state, {payload: {msg, status}}) => ({...state, loading: false, error: { msg, status }}),
        [gameList.succeeded]: (state, {payload: {list}}) => ({...state, list, loading: false, error: noError()}),

        [gameCreate.succeeded]: (state, {payload: {ownerName, x}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    playerName: ownerName,
                    isOwner: true,
                    status: GameStatuses.WAITING,
                    x
                },
                error: noError()
            }),
        [gameCreate.failed]: (state, {payload: {msg, status}}) => ({...state, loading: false, error: {msg, status}}),

        [gameConnect.succeeded]: (state, {payload: {opponentName, x}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    playerName: opponentName,
                    isOwner: false,
                    status: GameStatuses.ACTIVE,
                    x
                },
                error: noError()
            }),
        [gameConnect.failed]: (state, {payload: {msg, status}}) => ({...state, loading: false, error: {msg, status}}),

        [gameSession.requested]: state => ({...state, loading: true}),
        [gameSession.succeeded]: (state, {payload: {board, gameName, status, shouldWait, threshold, win, owner, playerName, x}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    board, status, win, shouldWait, isOwner: owner, playerName, gameName, x, threshold
                },
                loading: false,
                error: noError()
            }),
        [gameSession.failed]: (state, {payload: {msg, status}}) => ({...state, loading: false, error: {msg, status}}),

        [gameStatus.requested]: state => ({...state, loading: true}),
        [gameStatus.succeeded]: (state, {payload: {status, ownerName, gameName, threshold}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    status, playerName: ownerName, gameName, threshold
                },
                loading: false,
                error: noError()
            }),
        [gameStatus.failed]: (state, {payload: {msg, status}}) => ({...state, loading: false, error: {msg, status}}),

        // WS messages:
        [dashboardSync]: (state, {payload: {type, gameId, status, lastTurn, owner, threshold}}) => (type === 'UPDATED' ? {
                    ...state,
                    list: state.list.map(g => (g.gameId === gameId ? {...g, status, lastTurn} : {...g}))
                } : {
                    ...state,
                    list: state.list.concat({gameId, status, owner, threshold})
                }),
        [gameSessionSync]: (state, {payload: {board, status, wait, win}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    board, status, win,
                    shouldWait: wait === WaitStatuses.OWNER && state.session.isOwner
                        || wait === WaitStatuses.OPPONENT && !state.session.isOwner
                }
            }
        )
    },
    defaultState
);

export default reducer;
