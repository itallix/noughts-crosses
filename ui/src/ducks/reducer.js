import {handleActions} from 'redux-actions';

import {dashboardSync, gameConnect, gameCreate, gameList, gameSession, gameSessionSync} from "./actions";
import {GameStatuses, WaitStatuses} from "../app.types";

export const defaultState = {
    list: [],
    session: {
        shouldWait: false,
        isOwner: false,
        board: Array(10).fill(0).map(() => Array(10).fill(0)),
        playerName: null,
        status: null,
        lastTurn: null,
        win: null
    },
    loading: false,
    error: false
};

const reducer = handleActions({
        [gameList.requested]: state => ({...state, loading: true}),
        [gameList.failed]: state => ({...state, loading: false, error: true}),
        [gameList.succeeded]: (state, {payload: {list}}) => ({...state, list, loading: false, error: false}),

        [gameCreate.succeeded]: (state, {payload: {ownerName}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    playerName: ownerName,
                    isOwner: true,
                    status: GameStatuses.WAITING
                }
            }),
        [gameCreate.failed]: state => ({...state, loading: false, error: true}),

        [gameConnect.succeeded]: (state, {payload: {opponentName}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    playerName: opponentName,
                    isOwner: false,
                    status: GameStatuses.ACTIVE
                }
            }),
        [gameConnect.failed]: state => ({...state, loading: false, error: true}),

        [gameSession.requested]: state => ({...state, loading: true}),
        [gameSession.succeeded]: (state, {payload: {board, status, shouldWait, win, owner, playerName}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    board, status, win, shouldWait, isOwner: owner, playerName
                },
                loading: false,
                error: false
            }),
        [gameSession.failed]: state => ({...state, loading: false, error: true}),
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
