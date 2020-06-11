package io.karniushin.tictactoe.core.controller.view;

import io.karniushin.tictactoe.core.domain.GameStatus;

public class GameStatusView {

    private final String ownerName;

    private final String gameName;

    private final GameStatus status;

    public GameStatusView(final String ownerName, final String gameName, final GameStatus status) {
        this.ownerName = ownerName;
        this.gameName = gameName;
        this.status = status;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public String getGameName() {
        return gameName;
    }

    public GameStatus getStatus() {
        return status;
    }
}
