import React from "react";
import {ReactReduxContext} from "react-redux";
import {ConnectedRouter} from 'connected-react-router'
import {Route, Switch} from "react-router-dom";
import {history} from './app.store';

import GameListContainer from "./containers/game-list.container";
import GameBoardContainer from "./containers/game-board.container";
import 'antd/dist/antd.css';
import './App.scss';

const App = () => <ConnectedRouter history={history} context={ReactReduxContext}>
    <Switch>
        <Route exact path="/">
            <GameListContainer/>
        </Route>
        <Route path="/:gameId/:playerId" render={props => <GameBoardContainer {...props.match.params} />}/>
    </Switch>
</ConnectedRouter>;

export default App;
