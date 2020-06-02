package io.karniushin.tictactoe.core.domain;

import java.util.UUID;

import static java.util.UUID.randomUUID;

public class Player {

    private final UUID id;
    private final String username;

    public Player(String username) {
        this.id = randomUUID();
        this.username = username;
    }

    public UUID getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", username='" + username + '\'' +
                '}';
    }
}
