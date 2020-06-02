package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class VerticalWin extends WinCondition {

    public VerticalWin() {
        this.type = WinResult.WinResultType.Y;
    }

    @Override
    protected WinResult detectWinner(final int x, final int y, final short[][] board, final short search, final int threshold) {
        for (int i = x - 1; y >= 0 && i >= 0 && board[i][y] == search; i--) {
            winningLine.add(0, new WinResult.Coords(i, y));
            if (thresholdReached(threshold)) {
                return winner(search);
            }
        }
        for (int i = x + 1; y < BOARD_DIMENSION && i < BOARD_DIMENSION && board[i][y] == search; i++) {
            winningLine.add(new WinResult.Coords(i, y));
            if (thresholdReached(threshold)) {
                return winner(search);
            }
        }
        return null;
    }
}
