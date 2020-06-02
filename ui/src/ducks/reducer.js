import {handleActions} from 'redux-actions';

import {gameList, gameCreate, gameConnect, gameSession, updateDashboard} from "./actions";
import {GameStatuses, WaitStatuses} from "../app.types";

export const defaultState = {
    list: [],
    session: {
        gameId: null,
        shouldWait: false,
        isOwner: false,
        board: Array(10).fill(0).map(() => Array(10).fill(0)),
        playerId: null,
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
        [gameCreate.succeeded]: (state, {payload: {gameId, ownerId, ownerName}}) => { console.log(gameId, ownerId, ownerName); return (
            {
                ...state,
                session: {
                    ...state.session,
                    gameId,
                    playerId: ownerId,
                    playerName: ownerName,
                    isOwner: true,
                    status: GameStatuses.WAITING
                }
            })},
        [gameCreate.failed]: state => ({...state, loading: false, error: true}),
        [gameConnect.succeeded]: (state, {payload: {gameId, opponentId, opponentName}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    gameId: gameId,
                    playerId: opponentId,
                    playerName: opponentName,
                    isOwner: false,
                    status: GameStatuses.ACTIVE
                }
            }),
        [gameConnect.failed]: state => ({...state, loading: false, error: true}),
        [gameSession.succeeded]: (state, {payload: {board, status, wait, shouldWait, win}}) => (
            {
                ...state,
                session: {
                    ...state.session,
                    board, status, win,
                    shouldWait: wait ? (wait === WaitStatuses.OWNER && state.session.isOwner || wait === WaitStatuses.OPPONENT && !state.session.isOwner) : shouldWait
                }
            }),
        [updateDashboard]: (state, {payload: {type, gameId, status, lastTurn, owner, threshold}}) => (type === 'UPDATED' ? {
                    ...state,
                    list: state.list.map(g => (g.gameId === gameId ? {...g, status, lastTurn} : {...g}))
                } : {
                    ...state,
                    list: state.list.concat({gameId, status, owner, threshold})
                })
    },
    defaultState
);

export default reducer;
