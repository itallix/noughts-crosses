package io.karniushin.tictactoe.core.service.handler;

import java.util.UUID;

import io.karniushin.tictactoe.core.domain.GameSession;

public interface TurnHandler {

    void handle(GameSession session, UUID playerId, Integer x, Integer y);
}
