package io.karniushin.tictactoe.core.service.handler.rule;

import java.util.UUID;

import io.karniushin.tictactoe.core.domain.GameSession;

public interface GameRule {

    void execute(GameSession session, UUID playerId, Integer x, Integer y);
}
