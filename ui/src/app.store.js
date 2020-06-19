/* global window */
import {applyMiddleware, compose, createStore, combineReducers} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history'
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

export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
    const createRootReducer = (history) => combineReducers({
        ticTacReducer,
        router: connectRouter(history),
    });

    const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)));

    const store = createStore(createRootReducer(history), preloadedState, enhancer);

    sagaMiddleware.run(combinedSaga);

    return store;
}
/* eslint-enable */