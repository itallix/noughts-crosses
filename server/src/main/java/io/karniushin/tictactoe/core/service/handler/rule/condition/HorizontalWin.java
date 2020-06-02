package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class HorizontalWin extends WinCondition {

    public HorizontalWin() {
        this.type = WinResult.WinResultType.X;
    }

    @Override
    protected WinResult detectWinner(final int x, final int y, final short[][] board, final short search, final int threshold) {
        for (int i = y - 1; x >= 0 && i >= 0 && board[x][i] == search; i--) {
            winningLine.add(0, new WinResult.Coords(x, i));
            if (thresholdReached(threshold)) {
                return winner(search);
            }
        }
        for (int i = y + 1; x < BOARD_DIMENSION && i < BOARD_DIMENSION && board[x][i] == search; i++) {
            winningLine.add(new WinResult.Coords(x, i));
            if (thresholdReached(threshold)) {
                return winner(search);
            }
        }
        return null;
    }
}
