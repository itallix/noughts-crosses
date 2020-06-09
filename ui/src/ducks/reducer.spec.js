import reducer, {defaultState as initialState} from './reducer';
import {dashboardSync, gameConnect, gameCreate, gameList, gameSession, gameSessionSync} from './actions';
import {GameStatuses, WaitStatuses} from "../app.types";

describe('TicTacToe reducer', () => {

    test('should set loading when gameList requested', () => {
        const state = reducer(initialState, gameList.requested());
        expect(state.loading).toEqual(true);
    });

    test('should set list of games when gameList succeeded', () => {
        const data = [{
            gameId: 'uuid1', owner: 'Daniel', status: GameStatuses.ACTIVE
        }, {
            gameId: 'uuid2', owner: 'Sebastian', status: GameStatuses.WAITING
        }];
        const state = reducer(initialState, gameList.succeeded(data));
        expect(state).toMatchObject({
            list: data,
            loading: false,
            error: false
        });
    });

    test('should set error when gameList failed', () => {
        const state = reducer(initialState, gameList.failed());
        expect(state).toMatchObject({
            loading: false,
            error: true
        });
    });

    test('should initialize session when gameCreate succeeded', () => {
        const state = reducer(initialState, gameCreate.succeeded({ ownerName: 'Vincent' }));
        expect(state).toMatchObject({
            session: {
                playerName: 'Vincent',
                isOwner: true,
                status: GameStatuses.WAITING
            }
        });
    });

    test('should set error when gameCreate failed', () => {
        const state = reducer(initialState, gameCreate.failed());
        expect(state).toMatchObject({
            error: true
        });
    });

    test('should update session when gameConnect succeeded', () => {
        const state = reducer(initialState, gameConnect.succeeded({ opponentName: 'Christian' }));
        expect(state).toMatchObject({
            session: {
                playerName: 'Christian',
                isOwner: false,
                status: GameStatuses.ACTIVE
            }
        });
    });

    test('should set error when gameConnect failed', () => {
        const state = reducer(initialState, gameConnect.failed());
        expect(state).toMatchObject({
            error: true
        });
    });

    test('should update board when gameSession succeeded', () => {
        const board = Array(10).fill(0).map(() => Array(10).fill(0));
        for (let i = 0; i < 4; i++) {
            board[i][i] = 1;
        }
        let state = reducer({...initialState, session: {...initialState.session, isOwner: true} },
            gameSession.succeeded({
                board, shouldWait: true, status: GameStatuses.ACTIVE, owner: true,
            }));
        expect(state).toMatchObject({
            session: {
                board,
                shouldWait: true,
                status: GameStatuses.ACTIVE
            }
        });

        state = reducer({...initialState, session: {...initialState.session, isOwner: true} },
            gameSession.succeeded({
                board, shouldWait: false, status: GameStatuses.ACTIVE, owner: true
            }));
        expect(state).toMatchObject({
            session: {
                board,
                shouldWait: false,
                status: GameStatuses.ACTIVE
            }
        });
    });

    test('should set error when gameSession failed', () => {
        const state = reducer(initialState, gameSession.failed());
        expect(state).toMatchObject({
            error: true
        });
    });

    test('should process dashboardSync', () => {
        const data = [{
            gameId: 'uuid1', owner: 'Daniel', status: GameStatuses.ACTIVE
        }, {
            gameId: 'uuid2', owner: 'Sebastian', status: GameStatuses.WAITING
        }];
        let state = reducer({...initialState, list: data}, dashboardSync({type: "UPDATED", gameId: 'uuid2', status: GameStatuses.ACTIVE}));
        expect(state).toMatchObject({
            list: [{
                gameId: 'uuid1', owner: 'Daniel', status: GameStatuses.ACTIVE
            }, {
                gameId: 'uuid2', owner: 'Sebastian', status: GameStatuses.ACTIVE
            }],
            loading: false,
            error: false
        });

        state = reducer({...initialState, list: data}, dashboardSync({
            type: "ADDED", gameId: 'uuid3', owner: 'Christina', status: GameStatuses.FINISHED
        }));
        expect(state).toMatchObject({
            list: [{
                gameId: 'uuid1', owner: 'Daniel', status: GameStatuses.ACTIVE
            }, {
                gameId: 'uuid2', owner: 'Sebastian', status: GameStatuses.WAITING
            }, {
                gameId: 'uuid3', owner: 'Christina', status: GameStatuses.FINISHED
            }],
            loading: false,
            error: false
        });
    });

    test('should process sessionSync', () => {
        const board = Array(10).fill(0).map(() => Array(10).fill(0));
        for (let i = 0; i < 4; i++) {
            board[i][i] = 1;
        }
        let state = reducer({...initialState, session: {...initialState.session, isOwner: true} },
            gameSessionSync({
                board, wait: WaitStatuses.OPPONENT, status: GameStatuses.ACTIVE, owner: true,
            }));
        expect(state).toMatchObject({
            session: {
                board,
                shouldWait: false,
                status: GameStatuses.ACTIVE
            }
        });

        state = reducer({...initialState, session: {...initialState.session, isOwner: true} },
            gameSessionSync({
                board, wait: WaitStatuses.OWNER, status: GameStatuses.WAITING, owner: true,
            }));
        expect(state).toMatchObject({
            session: {
                board,
                shouldWait: true,
                status: GameStatuses.WAITING
            }
        });
    });
});
