package io.karniushin.tictactoe.core.service;

import io.karniushin.tictactoe.core.domain.GameSession;

import java.util.List;
import java.util.UUID;

public interface GameService {

    GameSession newGame(String username, String gameName, Integer threshold, boolean isX);

    GameSession connect(UUID gameId, String username);

    GameSession makeTurn(UUID gameId, UUID playerId, Integer x, Integer y);

    List<GameSession> list();

    //for testing
    UUID addGame(GameSession gameSession);

    GameSession getGame(UUID gameId);

    void clean();
}
