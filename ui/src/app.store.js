/* global window */
import {applyMiddleware, compose, createStore, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all, call} from 'redux-saga/effects';
import { ticTacReducer, ticTacSagas } from './ducks';

const sagaMiddleware = createSagaMiddleware();

function* combinedSaga() {
    while (true) {
        try {
            yield all([
                call(ticTacSagas)
            ]);
        } catch (e) {
            /* eslint-disable no-console */
            console.error('TicTacToe root saga:', e);
            /* eslint-enable */
        }
    }
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            name: 'tictactoe'
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;



function configureStore(preloadedState) {
    const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

    const store = createStore(combineReducers({ticTacReducer}), preloadedState, enhancer);

    sagaMiddleware.run(combinedSaga);

    if (window.Cypress) {
        window.__store__ = store;
    }

    return store;
}

export const store = configureStore();
/* eslint-enable */