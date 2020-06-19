package io.karniushin.tictactoe.core.service.handler.rule;

import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;
import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

@RunWith( SpringRunner.class )
@SpringBootTest
public class DefaultEndGameRuleTests {

    @Autowired
    private DefaultEndGameRule endGame;

    @Test
    public void shouldEndGameWhenHorizontalWinDetected() {
        UUID ownerId = UUID.randomUUID();
        UUID opponentId = UUID.randomUUID();
        short[][] board = new short[BOARD_DIMENSION][BOARD_DIMENSION];
        board[2] = new short[]{0, -1, 0, 0, 1, 1, 1, 1, 1, 0};
        GameSession session = new GameSession.GameSessionBuilder(ownerId, board)
                .withThreshold(5)
                .withOwnerTurnCount(5)
                .withOpponentId(opponentId)
                .build();
        endGame.execute(session, ownerId, 2, 6);
        assertTrue(session.isFinished());
        WinResult win = session.getWin();
        assertEquals(win.getType(), WinResult.WinResultType.X);
        assertEquals(win.getWho(), 1);
        List<WinResult.Coords> winLine = IntStream.rangeClosed(4, 8)
                .mapToObj(n -> new WinResult.Coords(2, n)).collect(toList());
        assertEquals(win.getSeq(), winLine);
    }

    @Test
    public void shouldEndGameWhenVerticalWinDetected() {
        UUID ownerId = UUID.randomUUID();
        UUID opponentId = UUID.randomUUID();
        short[][] board = new short[BOARD_DIMENSION][BOARD_DIMENSION];
        for (int i = 5; i < BOARD_DIMENSION; i++) {
            board[i][5] = -1;
        }
        GameSession session = new GameSession.GameSessionBuilder(ownerId, board)
                .withThreshold(5)
                .withOpponentTurnCount(5)
                .withOpponentId(opponentId)
                .build();
        endGame.execute(session, opponentId, 6, 5);
        assertTrue(session.isFinished());
        WinResult win = session.getWin();
        assertEquals(win.getType(), WinResult.WinResultType.Y);
        assertEquals(win.getWho(), -1);
        List<WinResult.Coords> winLine = IntStream.rangeClosed(5, 9)
                .mapToObj(n -> new WinResult.Coords(n, 5)).collect(toList());
        assertEquals(win.getSeq(), winLine);
    }

    @Test
    public void shouldEndGameWhenPrincipalDiagonalWinDetected() {
        UUID ownerId = UUID.randomUUID();
        short[][] board = new short[BOARD_DIMENSION][BOARD_DIMENSION];
        for (int i = 0, j = 0; i < 5 && j < 5; i++, j++) {
            board[i][j] = 1;
        }
        GameSession session = new GameSession.GameSessionBuilder(ownerId, board)
                .withThreshold(5)
                .withOwnerTurnCount(5)
                .build();
        endGame.execute(session, ownerId, 2, 2);
        assertTrue(session.isFinished());
        WinResult win = session.getWin();
        assertEquals(win.getType(), WinResult.WinResultType.D);
        assertEquals(win.getWho(), 1);
        List<WinResult.Coords> winLine = IntStream.rangeClosed(0, 4)
                .mapToObj(n -> new WinResult.Coords(n, n)).collect(toList());
        assertEquals(win.getSeq(), winLine);
    }

    @Test
    public void shouldEndGameWhenSecondaryDiagonalWinDetected() {
        UUID ownerId = UUID.randomUUID();
        UUID opponentId = UUID.randomUUID();
        short[][] board = new short[BOARD_DIMENSION][BOARD_DIMENSION];
        for (int i = 5, j = 4; i < BOARD_DIMENSION && j >= 0; i++, j--) {
            board[i][j] = -1;
        }
        GameSession session = new GameSession.GameSessionBuilder(ownerId, board)
                .withOpponentId(opponentId)
                .withThreshold(5)
                .withOpponentTurnCount(5)
                .build();
        endGame.execute(session, opponentId, 9, 0);
        assertTrue(session.isFinished());
        WinResult win = session.getWin();
        assertEquals(win.getType(), WinResult.WinResultType.D);
        assertEquals(win.getWho(), -1);
        List<WinResult.Coords> winLine = IntStream.rangeClosed(5, 9)
                .mapToObj(n -> new WinResult.Coords(n, 9 - n)).collect(toList());
        assertEquals(win.getSeq(), winLine);
    }

    @Test
    public void shouldEndGameWhenDrawDetected() {
        UUID ownerId = UUID.randomUUID();
        UUID opponentId = UUID.randomUUID();
        short[][] board = new short[BOARD_DIMENSION][BOARD_DIMENSION];
        for (int i = 0; i < BOARD_DIMENSION; i++) {
            board[i] = i % 2 == 0 ? new short[] {-1, -1, -1, -1, -1, 1, 1, 1, 1, 1} : new short[] {1, 1, 1, 1, 1, -1, -1, -1, -1, -1};
        }
        GameSession session = new GameSession.GameSessionBuilder(ownerId, board)
                .withOpponentId(opponentId)
                .withThreshold(10)
                .withOwnerTurnCount(50)
                .withOpponentTurnCount(50)
                .build();
        endGame.execute(session, opponentId, 9, 9);
        assertTrue(session.isFinished());
        WinResult win = session.getWin();
        assertNull(win.getType());
        assertEquals(win.getWho(), 0);
        assertNull(win.getSeq());
    }
}
