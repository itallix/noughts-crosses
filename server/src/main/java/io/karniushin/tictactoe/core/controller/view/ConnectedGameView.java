package io.karniushin.tictactoe.core.controller.view;

import java.util.UUID;

public class ConnectedGameView {

    private UUID opponentId;

    private boolean x;

    public ConnectedGameView() {}

    public ConnectedGameView(final UUID opponentId, final boolean x) {
        this.opponentId = opponentId;
        this.x = x;
    }

    public UUID getOpponentId() {
        return opponentId;
    }

    public boolean isX() {
        return x;
    }
}
