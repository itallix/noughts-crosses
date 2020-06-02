package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class SecondaryWin extends WinCondition {

    public SecondaryWin() {
        this.type = WinResult.WinResultType.D;
    }

    @Override
    protected WinResult detectWinner(final int x, final int y, final short[][] board, final short search, final int threshold) {
        if (x > 0 && y < BOARD_DIMENSION) {
            for (int i = x - 1, j = y + 1; i >= 0 && j < BOARD_DIMENSION && board[i][j] == search; i--, j++) {
                winningLine.add(0, new WinResult.Coords(i, j));
                if (thresholdReached(threshold)) {
                    return winner(search);
                }
            }
        }
        if (x < BOARD_DIMENSION && y > 0) {
            for (int i = x + 1, j = y - 1; i < BOARD_DIMENSION && j >= 0 && board[i][j] == search; i++, j--) {
                winningLine.add(new WinResult.Coords(i, j));
                if (thresholdReached(threshold)) {
                    return winner(search);
                }
            }
        }
        return null;
    }
}
