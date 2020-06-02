package io.karniushin.tictactoe.core.service.msg;

import io.karniushin.tictactoe.core.domain.GameSession;

public interface MessageSender {

    void notifyGameCreated(GameSession session);

    void notifyGameUpdated(GameSession session);
}
