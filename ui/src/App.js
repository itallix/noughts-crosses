import React from "react";
import {ConnectedRouter} from 'connected-react-router'
import {Route, Switch} from "react-router-dom";
import {history} from './app.store';

import GameConnect from "./containers/game-connect.container";
import Dashboard from "./containers/game-list.container";
import GameBoard from "./containers/game-board.container";
import 'antd/dist/antd.css';
import './App.scss';

const App = () => <ConnectedRouter history={history}>
    <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/:gameId/:playerId" render={props => <GameBoard {...props.match.params} />}/>
        <Route path="/:gameId" render={props => <GameConnect {...props.match.params}/>}/>
    </Switch>
</ConnectedRouter>;

export default App;
