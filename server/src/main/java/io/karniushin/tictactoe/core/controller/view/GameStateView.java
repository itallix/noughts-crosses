package io.karniushin.tictactoe.core.controller.view;

import io.karniushin.tictactoe.core.domain.GameStatus;
import io.karniushin.tictactoe.core.domain.WinResult;

public class GameStateView {

    private final short[][] board;
    private final boolean shouldWait;
    private final GameStatus status;
    private final WinResult win;

    public GameStateView(final short[][] board, final boolean shouldWait, final GameStatus status, final WinResult win) {
        this.board = board;
        this.shouldWait = shouldWait;
        this.status = status;
        this.win = win;
    }

    public short[][] getBoard() {
        return board;
    }

    public boolean isShouldWait() {
        return shouldWait;
    }

    public GameStatus getStatus() {
        return status;
    }

    public WinResult getWin() {
        return win;
    }
}
