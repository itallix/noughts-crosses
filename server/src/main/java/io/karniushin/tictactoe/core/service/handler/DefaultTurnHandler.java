package io.karniushin.tictactoe.core.service.handler;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.service.handler.rule.GameRule;

@Component
public class DefaultTurnHandler implements TurnHandler {

    private final List<GameRule> rules;

    @Autowired
    public DefaultTurnHandler(List<GameRule> rules) {
        this.rules = rules;
    }

    @Override
    public void handle(final GameSession session, final UUID playerId, final Integer x, final Integer y) {
        rules.forEach(rule -> rule.execute(session, playerId, x, y));
    }
}
