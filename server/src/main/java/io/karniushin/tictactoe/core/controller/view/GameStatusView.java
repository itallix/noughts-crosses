package io.karniushin.tictactoe.core.controller.view;

import io.karniushin.tictactoe.core.domain.GameStatus;

public class GameStatusView {

    private final String ownerName;

    private final GameStatus status;

    public GameStatusView(final String ownerName, final GameStatus status) {
        this.ownerName = ownerName;
        this.status = status;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public GameStatus getStatus() {
        return status;
    }
}
