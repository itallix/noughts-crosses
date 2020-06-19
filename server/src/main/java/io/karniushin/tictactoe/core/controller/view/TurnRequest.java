package io.karniushin.tictactoe.core.controller.view;

import java.util.UUID;

public class TurnRequest {

    private UUID gameId;

    private UUID playerId;

    private Integer x;

    private Integer y;

    public TurnRequest() {}

    public TurnRequest(UUID gameId, UUID playerId, Integer x, Integer y) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.x = x;
        this.y = y;
    }

    public UUID getGameId() {
        return gameId;
    }

    public void setGameId(UUID gameId) {
        this.gameId = gameId;
    }

    public UUID getPlayerId() {
        return playerId;
    }

    public void setPlayerId(UUID playerId) {
        this.playerId = playerId;
    }

    public Integer getX() {
        return x;
    }

    public void setX(final Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(final Integer y) {
        this.y = y;
    }
}
