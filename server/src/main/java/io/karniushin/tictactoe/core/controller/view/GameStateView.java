package io.karniushin.tictactoe.core.controller.view;

import io.karniushin.tictactoe.core.domain.GameStatus;
import io.karniushin.tictactoe.core.domain.WinResult;

public class GameStateView {

    private final short[][] board;
    private final boolean shouldWait;
    private final GameStatus status;
    private final WinResult win;
    private final boolean isOwner;
    private final String playerName;
    private final boolean x;

    public GameStateView(final short[][] board, final boolean shouldWait, final GameStatus status, final WinResult win, final boolean isOwner,
                         final String playerName, final boolean x) {
        this.board = board;
        this.shouldWait = shouldWait;
        this.status = status;
        this.win = win;
        this.isOwner = isOwner;
        this.playerName = playerName;
        this.x = x;
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

    public boolean isOwner() {
        return isOwner;
    }

    public String getPlayerName() {
        return playerName;
    }

    public boolean isX() {
        return x;
    }
}
