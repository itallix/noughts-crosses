package io.karniushin.tictactoe.core.service;

import io.karniushin.tictactoe.core.domain.Player;

import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Default registry implementation assumes that user names must be globally unique
 */
@Component
public class PlayerRegistryImpl implements PlayerRegistry {

    private final ConcurrentMap<UUID, Player> players = new ConcurrentHashMap<>();

    public static final String PLAYER_EXISTS = "Player with name [%s] has been already registered";
    public static final String PLAYER_UNKNOWN = "UNKNOWN";

    @Override
    public Player registerPlayer(String name) {
        players.values().stream()
            .filter(p -> p.getUsername().equalsIgnoreCase(name))
            .findAny()
            .ifPresent(p -> { throw new IllegalArgumentException(String.format(PLAYER_EXISTS, p.getUsername())); });
        Player player = new Player(name);
        players.put(player.getId(), player);
        return player;
    }

    @Override
    public String getNameById(UUID id) {
        return Optional.ofNullable(players.get(id)).map(Player::getUsername).orElse(PLAYER_UNKNOWN);
    }

    @Override
    public void reset() {
        players.clear();
    }
}
