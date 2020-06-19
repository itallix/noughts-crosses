package io.karniushin.tictactoe.core.service.handler.rule;

import java.util.Objects;
import java.util.UUID;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import io.karniushin.tictactoe.core.domain.GameSession;

@Component
@Order(1)
public class DefaultTurnRule implements GameRule {

    @Override
    public void execute(GameSession session, UUID playerId, Integer x, Integer y) {
        validate(session, playerId, x, y);
        session.set(playerId, x, y);
    }

    public static final String NO_OPPONENT_CONNECTED = "Turn cannot be processed without opponent connected";
    public static final String GAME_FINISHED = "Turn cannot be processed when game has been finished";
    public static final String NOT_REGISTERED = "Turn cannot be processed with non registered user";
    public static final String ANOTHER_PLAYER = "Turn cannot be processed for this player, waiting for another player to make a turn";
    public static final String NOT_IN_RANGE = "Turn cannot be processed when position of any coordinate is not in range [0; 9]";
    public static final String BUSY = "Turn cannot be processed when cell is already busy";

    private void validate(GameSession session, UUID playerId, Integer x, Integer y) {
        if (session.isWaiting()) {
            throw new IllegalStateException(NO_OPPONENT_CONNECTED);
        }
        if (session.isFinished()) {
            throw new IllegalStateException(GAME_FINISHED);
        }
        boolean isOwner = session.isOwner(playerId);
        if (isOwner && !Objects.equals(session.getOwnerId(), playerId) ||
                !isOwner && !Objects.equals(session.getOpponentId(), playerId)) {
            throw new IllegalArgumentException(NOT_REGISTERED);
        }
        if (!session.canMakeTurn(playerId)) {
            throw new IllegalArgumentException(ANOTHER_PLAYER);
        }
        if (!session.isInRange(x, y)) {
            throw new IllegalArgumentException(NOT_IN_RANGE);
        }
        if (!session.isFree(x, y)) {
            throw new IllegalArgumentException(BUSY);
        }
    }
}
