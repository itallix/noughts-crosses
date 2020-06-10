import axios from 'axios';

const API_BASE_URL = 'api/v1/tictac';

const instance = axios.create();

export function listGameSessions() {
    return instance.get(`/${API_BASE_URL}/list`).then(resp => resp.data);
}

export function connectToGame(gameId, username) {
    return instance.put(`/${API_BASE_URL}/${gameId}/connect/${username}`).then(resp => resp.data);
}

export function createNewGame(username, threshold, x) {
    return instance.post(`/${API_BASE_URL}/create`, {username, threshold, x}).then(resp => resp.data);
}

export function makeTurn(gameId, playerId, row, col) {
    return instance.put(`/${API_BASE_URL}/turn`, {gameId, playerId, x: row, y: col}).then(resp => resp.data);
}

export function getGameState(gameId, playerId) {
    return instance.get(`/${API_BASE_URL}/${gameId}/${playerId}`).then(resp => resp.data);
}
