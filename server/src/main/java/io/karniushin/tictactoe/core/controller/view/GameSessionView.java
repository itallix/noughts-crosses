package io.karniushin.tictactoe.core.controller.view;

import java.util.UUID;

import io.karniushin.tictactoe.core.domain.GameStatus;

public class GameSessionView {

    private UUID gameId;

    private String owner;

    private GameStatus status;

    private Integer threshold;

    private Long lastTurn;


    public GameSessionView() {
    }

    public GameSessionView(final UUID gameId, final GameStatus status, final Integer threshold, final Long lastTurn) {
        this.gameId = gameId;
        this.status = status;
        this.threshold = threshold;
        this.lastTurn = lastTurn;
    }

    public UUID getGameId() {
        return gameId;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(final String owner) {
        this.owner = owner;
    }

    public GameStatus getStatus() {
        return status;
    }

    public Long getLastTurn() {
        return lastTurn;
    }

    public Integer getThreshold() {
        return threshold;
    }
}
