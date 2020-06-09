package io.karniushin.tictactoe.core.service;

import io.karniushin.tictactoe.core.domain.Player;

import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Default registry implementation assumes that users with the same name can exist
 */
@Component
public class PlayerRegistryImpl implements PlayerRegistry {

    private final ConcurrentMap<UUID, Player> players = new ConcurrentHashMap<>();

    @Override
    public Player registerPlayer(String name) {
        Player player = new Player(name);
        players.put(player.getId(), player);
        return player;
    }

    @Override
    public String getNameById(UUID id) {
        return Optional.ofNullable(players.get(id)).map(Player::getUsername).orElse("UNKNOWN");
    }
}
