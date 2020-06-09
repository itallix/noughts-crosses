import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, ReactReduxContext } from 'react-redux';

import configureStore from './app.store';
import './index.css';
import App from './App';

ReactDOM.render(
    <Provider store={configureStore()} context={ReactReduxContext}><App/></Provider>,
    document.getElementById('root')
);
