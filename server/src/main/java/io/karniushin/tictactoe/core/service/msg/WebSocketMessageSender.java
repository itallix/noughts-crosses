package io.karniushin.tictactoe.core.service.msg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.service.PlayerRegistry;

import static io.karniushin.tictactoe.core.service.msg.GameStateMessage.WaitStatus.NONE;
import static io.karniushin.tictactoe.core.service.msg.GameStateMessage.WaitStatus.OPPONENT;
import static io.karniushin.tictactoe.core.service.msg.GameStateMessage.WaitStatus.OWNER;

@Component
public class WebSocketMessageSender implements MessageSender {

    private final SimpMessagingTemplate messagingTemplate;

    private final PlayerRegistry playerRegistry;

    @Autowired
    public WebSocketMessageSender(final SimpMessagingTemplate messagingTemplate, final PlayerRegistry playerRegistry) {
        this.messagingTemplate = messagingTemplate;
        this.playerRegistry = playerRegistry;
    }

    @Override
    public void notifyGameCreated(final GameSession session) {
        messagingTemplate.convertAndSend("/topic/games", GameDashboardMessage.created(
                session.getId(), session.getStatus(), playerRegistry.getNameById(session.getOwnerId()), session.getThreshold()
        ));
    }

    @Override
    public void notifyGameUpdated(final GameSession session) {
        messagingTemplate.convertAndSend("/topic/games", GameDashboardMessage.updated(
                session.getId(), session.getStatus(), session.getLastTurnDate()
        ));
        notifyConnectedPlayers(session);
    }

    private void notifyConnectedPlayers(final GameSession session) {
        GameStateMessage.WaitStatus wait = NONE;
        if (!session.canMakeTurn(session.getOwnerId())) {
            wait = OWNER;
        } else if (!session.canMakeTurn(session.getOpponentId())) {
            wait = OPPONENT;
        }
        messagingTemplate.convertAndSend("/topic/" + session.getId(), new GameStateMessage(
                session.getBoard(), session.getStatus(), session.getWin(), wait
        ));
    }
}
