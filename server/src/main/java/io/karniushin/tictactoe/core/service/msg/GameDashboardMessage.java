package io.karniushin.tictactoe.core.service.msg;

import java.util.UUID;

import io.karniushin.tictactoe.core.domain.GameStatus;

public class GameDashboardMessage {

    private final DashboardMessageType type;

    private final UUID gameId;

    private final GameStatus status;

    private final Long lastTurn;

    private final String owner;

    private final Integer threshold;

    public GameDashboardMessage(final DashboardMessageType type, final UUID gameId, final GameStatus status, final String owner, final Integer threshold) {
        this(type, gameId, status, null, threshold, owner);
    }

    public GameDashboardMessage(final DashboardMessageType type, final UUID gameId, final GameStatus status, final long lastTurn) {
        this(type, gameId, status, lastTurn, null, null);
    }

    public GameDashboardMessage(final DashboardMessageType type, final UUID gameId, final GameStatus status, final Long lastTurn, final Integer threshold, final String owner) {
        this.type = type;
        this.gameId = gameId;
        this.status = status;
        this.lastTurn = lastTurn;
        this.threshold = threshold;
        this.owner = owner;
    }

    public DashboardMessageType getType() {
        return type;
    }

    public UUID getGameId() {
        return gameId;
    }

    public GameStatus getStatus() {
        return status;
    }

    public Long getLastTurn() {
        return lastTurn;
    }

    public String getOwner() {
        return owner;
    }

    public Integer getThreshold() {
        return threshold;
    }

    public static GameDashboardMessage created(UUID gameId, GameStatus status, String ownerName, Integer threshold) {
        return new GameDashboardMessage(DashboardMessageType.CREATED, gameId, status, ownerName, threshold);
    }

    public static GameDashboardMessage updated(UUID gameId, GameStatus status, Long lastTurn) {
        return new GameDashboardMessage(DashboardMessageType.UPDATED, gameId, status, lastTurn);
    }

    enum DashboardMessageType { CREATED, UPDATED }
}
