package io.karniushin.tictactoe.core.ex;

import java.util.UUID;

import static java.lang.String.format;

public class GameNotFoundException extends RuntimeException {

    private static final String MSG_TEMPLATE = "Game with id [%s] doesn't exist";

    public GameNotFoundException(final UUID gameId) {
        super(format(MSG_TEMPLATE, gameId));
    }
}
