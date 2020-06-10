package io.karniushin.tictactoe.core.service.handler.rule;

import java.util.UUID;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.domain.GameStatus;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.ANOTHER_PLAYER;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.BUSY;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.GAME_FINISHED;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.NOT_IN_RANGE;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.NOT_REGISTERED;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.NO_OPPONENT_CONNECTED;
import static java.util.UUID.randomUUID;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith( SpringRunner.class )
@SpringBootTest
public class DefaultTurnRuleTests {

    @Autowired
    private DefaultTurnRule turn;

    @Test
    public void shouldMakeTurn() {
        UUID ownerId = randomUUID();
        UUID opponentId = randomUUID();
        GameSession session = new GameSession.GameSessionBuilder(ownerId)
                .withOpponentId(opponentId)
                .build();
        short[][] board = session.getBoard();

        turn.execute(session, ownerId, 1, 1);
        assertEquals(board[1][1], 1);
        assertTrue(session.isInProgress());
        turn.execute(session, opponentId, 2, 2);
        assertEquals(board[2][2], -1);
        assertTrue(session.isInProgress());
    }

    @Rule
    public final ExpectedException expectedEx = ExpectedException.none();

    @Test
    public void shouldNotMakeTurnIfOpponentNotRegistered() {
        UUID ownerId = randomUUID();
        GameSession session = new GameSession(ownerId);
        expectedEx.expect(IllegalStateException.class);
        expectedEx.expectMessage(NO_OPPONENT_CONNECTED);
        turn.execute(session, ownerId, 1, 1);
    }

    @Test
    public void shouldNotMakeTurnIfGameFinished() {
        UUID ownerId = randomUUID();
        GameSession session = new GameSession.GameSessionBuilder(ownerId)
                .withOpponentId(randomUUID())
                .withStatus(GameStatus.FINISHED)
                .build();
        expectedEx.expect(IllegalStateException.class);
        expectedEx.expectMessage(GAME_FINISHED);
        turn.execute(session, ownerId, 1, 1);
    }

    @Test
    public void shouldNotMakeTurnWithUnknownUser() {
        GameSession session = new GameSession.GameSessionBuilder(randomUUID())
                .withOpponentId(randomUUID())
                .build();
        expectedEx.expect(IllegalArgumentException.class);
        expectedEx.expectMessage(NOT_REGISTERED);
        turn.execute(session, randomUUID(), 1, 1);
    }

    @Test
    public void shouldNotMakeTurnWithOwnerIfAnotherTurn() {
        UUID ownerId = randomUUID();
        GameSession session = new GameSession.GameSessionBuilder(ownerId)
                .withOpponentId(randomUUID())
                .withOwnerTurnCount(5)
                .withOpponentTurnCount(4)
                .build();
        expectedEx.expect(IllegalArgumentException.class);
        expectedEx.expectMessage(ANOTHER_PLAYER);
        turn.execute(session, ownerId, 1, 1);
    }

    @Test
    public void shouldNotMakeTurnWithOpponentIfAnotherTurn() {
        UUID opponentId = randomUUID();
        GameSession session = new GameSession.GameSessionBuilder(randomUUID())
                .withOpponentId(opponentId)
                .withOwnerTurnCount(4)
                .withOpponentTurnCount(5)
                .build();
        expectedEx.expect(IllegalArgumentException.class);
        expectedEx.expectMessage(ANOTHER_PLAYER);
        turn.execute(session, opponentId, 1, 1);
    }

    @Test
    public void shouldNotMakeTurnIfNotInRange() {
        UUID ownerId = randomUUID();
        GameSession session = new GameSession.GameSessionBuilder(ownerId)
                .withOpponentId(randomUUID())
                .build();
        expectedEx.expect(IllegalArgumentException.class);
        expectedEx.expectMessage(NOT_IN_RANGE);
        turn.execute(session, ownerId, 10, 2);
    }

    @Test
    public void shouldNotMakeTurnIfPositionIsBusy() {
        UUID opponentId = randomUUID();
        short[][] board = new short[BOARD_DIMENSION][BOARD_DIMENSION];
        board[1][1] = 1;
        GameSession session = new GameSession.GameSessionBuilder(randomUUID(), board)
                .withOpponentId(opponentId)
                .build();
        expectedEx.expect(IllegalArgumentException.class);
        expectedEx.expectMessage(BUSY);
        turn.execute(session, opponentId, 1, 1);
    }
}
