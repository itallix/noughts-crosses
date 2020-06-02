package io.karniushin.tictactoe.core.controller.view;

import java.util.UUID;

public class CreatedGameView {

    private UUID gameId;

    private UUID ownerId;

    public CreatedGameView() {
    }

    public CreatedGameView(final UUID gameId, final UUID ownerId) {
        this.gameId = gameId;
        this.ownerId = ownerId;
    }

    public UUID getGameId() {
        return gameId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }
}
