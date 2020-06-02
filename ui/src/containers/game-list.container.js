import {connect} from 'react-redux';
import GameListComponent from '../components/game-list.component';
import {gameConnect, gameCreate, gameList, setSymbol} from "../ducks/actions";

const mapStateToProps = state => {
    const {list, error, loading} = state.ticTacReducer;
    return {
        list,
        error,
        loading
    };
};

const mapDispatchToProps = dispatch => ({
    onConnect: (gameId, username) => dispatch(gameConnect.requested({gameId, username})),
    onCreate: (username, threshold, symbol) => dispatch(gameCreate.requested({username, threshold, symbol})),
    onReload: () => dispatch(gameList.requested())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameListComponent);
