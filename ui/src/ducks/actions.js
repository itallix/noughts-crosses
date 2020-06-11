import { createActions } from 'redux-actions';

export const {gameList, gameCreate, gameConnect, gameSession, gameTurnRequested, dashboardSync, dashboardLoaded, gameSessionSync, boardLoaded, gameStatus} =
    createActions({
    'GAME_LIST': {
        'REQUESTED': undefined,
        'SUCCEEDED': (data) => ({list: data}),
        'FAILED': undefined
    },
    'GAME_CREATE': {
        'REQUESTED': undefined,
        'SUCCEEDED': undefined,
        'FAILED': undefined
    },
    'GAME_CONNECT': {
        'REQUESTED': undefined,
        'SUCCEEDED': undefined,
        'FAILED': undefined
    },
    'GAME_SESSION': {
        'REQUESTED': undefined,
        'SUCCEEDED': undefined,
        'FAILED': undefined
    },
    'GAME_STATUS': {
        'REQUESTED': undefined,
        'SUCCEEDED': undefined,
        'FAILED': undefined
    },
    'GAME_TURN_REQUESTED': undefined,
    'DASHBOARD_SYNC': undefined,
    'DASHBOARD_LOADED': undefined,
    'GAME_SESSION_SYNC': undefined,
    'BOARD_LOADED': undefined
});
