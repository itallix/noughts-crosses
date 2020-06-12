import {connect} from 'react-redux';
import GameListComponent from '../components/dashboard/game-list.component';
import {dashboardLoaded, gameConnect, gameCreate, gameList} from "../ducks/actions";

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
    onCreate: (gameName, username, threshold, symbol) => dispatch(gameCreate.requested({gameName, username, threshold, symbol})),
    onReload: () => dispatch(gameList.requested()),
    onInit: () => {
        dispatch(dashboardLoaded());
        dispatch(gameList.requested());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(GameListComponent);
