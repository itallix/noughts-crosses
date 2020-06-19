import {connect} from 'react-redux';
import GameConnectComponent from '../components/connect/game-connect.component';
import {gameConnect, gameStatus} from "../ducks/actions";

const mapStateToProps = state => {
    const {error, loading} = state.ticTacReducer;
    const {gameName, playerName, status, threshold} = state.ticTacReducer.session;
    return {
        error, gameName, loading, playerName, status, threshold
    };
};

const mapDispatchToProps = dispatch => ({
    onInit: (gameId) => dispatch(gameStatus.requested({gameId})),
    onConnect: (gameId, username) => dispatch(gameConnect.requested({gameId, username})),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameConnectComponent);
