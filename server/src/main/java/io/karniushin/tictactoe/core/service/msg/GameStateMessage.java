package io.karniushin.tictactoe.core.service.msg;

import io.karniushin.tictactoe.core.domain.GameStatus;
import io.karniushin.tictactoe.core.domain.WinResult;

public class GameStateMessage {

    private final short[][] board;
    private final GameStatus status;
    private final WinResult win;
    private final WaitStatus wait;

    public GameStateMessage(final short[][] board, final GameStatus status, final WinResult win, final WaitStatus wait) {
        this.board = board;
        this.status = status;
        this.win = win;
        this.wait = wait;
    }

    public short[][] getBoard() {
        return board;
    }

    public GameStatus getStatus() {
        return status;
    }

    public WinResult getWin() {
        return win;
    }

    public WaitStatus getWait() {
        return wait;
    }

    public enum WaitStatus { OWNER, OPPONENT, NONE }
}
