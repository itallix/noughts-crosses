package io.karniushin.tictactoe.core.controller.view;

import io.karniushin.tictactoe.core.domain.GameStatus;

public class GameStatusView {

    private final String ownerName;
    private final String gameName;
    private final GameStatus status;
    private final Integer threshold;

    public GameStatusView(final String ownerName, final String gameName, final GameStatus status, final Integer threshold) {
        this.ownerName = ownerName;
        this.gameName = gameName;
        this.status = status;
        this.threshold = threshold;
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

    public Integer getThreshold() { return threshold; }
}
