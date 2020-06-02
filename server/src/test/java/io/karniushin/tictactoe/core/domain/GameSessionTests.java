package io.karniushin.tictactoe.core.domain;

import java.util.UUID;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static java.util.UUID.randomUUID;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
public class GameSessionTests {

    @Test
    public void verifyInitialGameSessionState() {
        UUID playerId = randomUUID();
        GameSession session = new GameSession(playerId);
        assertEquals(session.getOwnerId(), playerId);
        assertNull(session.getOpponentId());
        assertTrue(session.isWaiting());
        short[][] board = session.getBoard();
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                assertEquals(board[i][j], 0);
            }
        }
    }

    @Test
    public void verifyIfCellIsFree() {
        UUID playerId = randomUUID();
        short[][] board = new short[10][10];
        board[1][1] = 1;
        GameSession session = new GameSession(playerId, board);
        assertFalse(session.isFree(1, 1));
        assertTrue(session.isFree(0, 0));
    }

    @Test
    public void verifyIsInRange() {
        UUID playerId = randomUUID();
        GameSession session = new GameSession(playerId);
        assertTrue(session.isInRange(1, 1));
        assertFalse(session.isInRange(11, 12));
        assertFalse(session.isInRange(1, 11));
        assertFalse(session.isInRange(12, 9));
    }

    @Test
    public void verifyCanMakeTurn() {
        UUID playerId = randomUUID();
        GameSession session = new GameSession(playerId);
        assertTrue(session.canMakeTurn(playerId));
        session.set(playerId, 1, 1);
        assertFalse(session.canMakeTurn(playerId));
        assertTrue(session.isInRange(1, 1));
    }
}
