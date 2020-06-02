import { createActions } from 'redux-actions';

export const {gameList, gameCreate, gameConnect, gameSession, gameTurnRequested, updateDashboard, appLoaded} =
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
        'SUCCEEDED': undefined
    },
    'GAME_TURN_REQUESTED': undefined,
    'UPDATE_DASHBOARD': undefined,
    'APP_LOADED': undefined
});
