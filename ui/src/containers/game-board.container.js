import {connect} from 'react-redux';
import GameBoardComponent from '../components/board/game-board.component';
import {gameTurnRequested, gameSession, boardLoaded} from "../ducks/actions";

const mapStateToProps = state => {
    const {connected, error, loading, session} = state.ticTacReducer;
    return {
        connected, error, loading, session
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
