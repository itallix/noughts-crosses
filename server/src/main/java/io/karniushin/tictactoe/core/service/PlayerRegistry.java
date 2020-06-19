package io.karniushin.tictactoe.core.service;

import io.karniushin.tictactoe.core.domain.Player;

import java.util.UUID;

public interface PlayerRegistry {

    Player registerPlayer(String name);

    String getNameById(UUID id);

    void reset();
}
