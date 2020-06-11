import {connect} from 'react-redux';
import GameBoardComponent from '../components/game-board.component';
import {gameTurnRequested, gameSession, boardLoaded} from "../ducks/actions";

const mapStateToProps = state => {
    const { error, loading } = state.ticTacReducer;
    const { gameName, isOwner, shouldWait, board, playerName, status, win, x } = state.ticTacReducer.session;
    return {
        error, loading, gameName, isOwner, shouldWait, board, playerName, status, win, x
    };
};

const mapDispatchToProps = dispatch => ({
    onInit: (gameId, playerId) => {
        dispatch(gameSession.requested({gameId, playerId}));
        dispatch(boardLoaded({gameId}));
    },
    onTurn: (gameId, playerId, row, col) => dispatch(gameTurnRequested({gameId, playerId, row, col})),
    onRefresh: (gameId, playerId) => dispatch(gameSession.requested({gameId, playerId}))
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoardComponent);