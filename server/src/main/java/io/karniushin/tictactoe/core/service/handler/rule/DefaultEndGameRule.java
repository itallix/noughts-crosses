package io.karniushin.tictactoe.core.service.handler.rule;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.domain.WinResult;
import io.karniushin.tictactoe.core.service.handler.rule.condition.*;

@Component
@Order(2)
public class DefaultEndGameRule implements GameRule {

    private final List<WinCondition> conditions = Arrays.asList(
            new HorizontalWin(),  new VerticalWin(), new PrincipalWin(), new SecondaryWin()
    );

    @Override
    public void execute(final GameSession session, UUID playerId, final Integer x, final Integer y) {
        boolean isOwner = session.isOwner(playerId);
        final int threshold = session.getThreshold();
        // check should be made after some amount of turns
        if (isOwner && session.getOwnerTurnCount() >= threshold || !isOwner && session.getOpponentTurnCount() >= threshold) {
            CheckParams params = new CheckParams(session.getBoard(), isOwner ? (short) 1 : -1, x, y, session.getThreshold());
            conditions.stream()
                    .map(c -> c.check(params))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .findFirst()
                    .ifPresent(session::setWin);
        }
        // detect draw
        if (session.getWin() == null && session.getOwnerTurnCount() + session.getOpponentTurnCount() == threshold * threshold) {
            session.setWin(new WinResult(null, (short) 0, null));
        }
    }
}
