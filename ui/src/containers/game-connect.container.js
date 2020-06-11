import {connect} from 'react-redux';
import GameConnectComponent from '../components/game-connect.component';
import {gameConnect, gameStatus} from "../ducks/actions";

const mapStateToProps = state => {
    const {error} = state.ticTacReducer;
    const {gameName, playerName, status} = state.ticTacReducer.session;
    return {
        error, gameName, playerName, status
    };
};

const mapDispatchToProps = dispatch => ({
    onInit: (gameId) => dispatch(gameStatus.requested({gameId})),
    onConnect: (gameId, username) => dispatch(gameConnect.requested({gameId, username})),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameConnectComponent);
