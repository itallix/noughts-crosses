import React from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';

import GameListContainer from "./containers/game-list.container";
import GameBoardContainer from "./containers/game-board.container";
import {appLoaded, gameList} from "./ducks/actions";
import 'antd/dist/antd.css';
import './App.scss';

export class App extends React.Component {

    static propTypes = {
        gameId: PropTypes.string,
        onInit: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onInit();
    }

    render() {
        const {gameId} = this.props;

        return<React.Fragment>
            {gameId && <GameBoardContainer/>}
            {!gameId && <GameListContainer/>}
        </React.Fragment>
    };
}

export default connect(
    state => ({
        gameId: state.ticTacReducer.session.gameId
    }),
    dispatch => ({
        onInit: () => {
            dispatch(appLoaded());
            dispatch(gameList.requested());
        }
    })
)(App);
