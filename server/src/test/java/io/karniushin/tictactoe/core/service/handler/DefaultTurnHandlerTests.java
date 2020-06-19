package io.karniushin.tictactoe.core.service.handler;

import java.util.UUID;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InOrder;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.service.handler.rule.DefaultEndGameRule;
import io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule;

import static org.mockito.Mockito.verifyNoMoreInteractions;

@RunWith( SpringRunner.class )
@SpringBootTest
public class DefaultTurnHandlerTests {

    @MockBean
    private DefaultTurnRule turn;

    @MockBean
    private DefaultEndGameRule endGame;

    @Autowired
    private TurnHandler handler;

    @Test
    public void shouldTriggerRules() {
        UUID playerId = UUID.randomUUID();
        GameSession session = new GameSession(playerId);
        handler.handle(session, playerId, 1, 1);

        InOrder rules = Mockito.inOrder(turn, endGame);
        rules.verify(turn).execute(session, playerId, 1, 1);
        rules.verify(endGame).execute(session, playerId, 1, 1);
        verifyNoMoreInteractions(turn, endGame);
    }
}
