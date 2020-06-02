import {connect} from 'react-redux';
import GameBoardComponent from '../components/game-board.component';
import {gameTurnRequested, gameSession} from "../ducks/actions";

const mapStateToProps = state => {
    const { gameId, isOwner, shouldWait, board, playerName, status, win } = state.ticTacReducer.session;
    return {
        gameId, isOwner, shouldWait, board, playerName, status, win
    };
};

const mapDispatchToProps = dispatch => ({
    onTurn: (row, col) => dispatch(gameTurnRequested({row, col})),
    onRefresh: () => dispatch(gameSession.requested())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoardComponent);