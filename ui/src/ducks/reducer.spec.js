import reducer, {defaultState as initialState} from './reducer';
import {gameList, gameCreate, gameConnect, gameSession, gameTurnRequested} from './actions';
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
        const state = reducer(initialState, gameCreate.succeeded({
            gameId: 'uuid-game', ownerId: 'uuid-owner', ownerName: 'Vincent'
        }));
        expect(state).toMatchObject({
            session: {
                gameId: 'uuid-game',
                playerId: 'uuid-owner',
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
        const state = reducer(initialState, gameConnect.succeeded(
            { gameId: 'uuid-game', isOwnerTurn: true, opponentId: 'uuid-user', opponentName: 'Christian' }
        ));
        expect(state).toMatchObject({
            session: {
                gameId: 'uuid-game',
                playerId: 'uuid-user',
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
                board, shouldWait: true, status: GameStatuses.ACTIVE
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
                board, wait: WaitStatuses.OPPONENT, status: GameStatuses.ACTIVE
            }));
        expect(state).toMatchObject({
            session: {
                board,
                shouldWait: false,
                status: GameStatuses.ACTIVE
            }
        });
    });
});
