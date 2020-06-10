package io.karniushin.tictactoe.core.support;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.domain.GameSession.GameSessionBuilder;
import io.karniushin.tictactoe.core.domain.Player;
import io.karniushin.tictactoe.core.service.GameService;
import io.karniushin.tictactoe.core.service.PlayerRegistry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.stream.IntStream;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

@Component
@Profile(value = {"dev", "test"})
public class Fixtures {

    private final GameService gameService;

    private final PlayerRegistry playerRegistry;

    @Autowired
    public Fixtures(GameService gameService, PlayerRegistry playerRegistry) {
        this.gameService = gameService;
        this.playerRegistry = playerRegistry;
    }

    public UUID initialSetupWithoutOpponent() {
        UUID playerA = UUID.randomUUID();
        return gameService.addGame(new GameSession(playerA));
    }

    public UUID initialSetup() {
        UUID playerA = UUID.randomUUID();
        UUID playerB = UUID.randomUUID();
        return gameService.addGame(new GameSessionBuilder(playerA)
                .withOpponentId(playerB)
                .build()
        );
    }

    public UUID ownerEndGameHorizontalSetup() {
        Player playerA = playerRegistry.registerPlayer("PlayerA");
        Player playerB = playerRegistry.registerPlayer("PlayerB");
        short[][] board = new short[BOARD_DIMENSION][BOARD_DIMENSION];
        IntStream.range(0, 9).forEach(n -> board[0][n] = 1);
        return gameService.addGame(new GameSessionBuilder(playerA.getId(), board)
                .withOpponentId(playerB.getId())
                .withOwnerTurnCount(9)
                .withOpponentTurnCount(9)
                .build()
        );
    }

    public UUID turnDisbalanceSetup() {
        UUID playerA = UUID.randomUUID();
        UUID playerB = UUID.randomUUID();
        return gameService.addGame(new GameSessionBuilder(playerA)
                .withOpponentId(playerB)
                .withOwnerTurnCount(8)
                .withOpponentTurnCount(9)
                .build()
        );
    }
}
