package io.karniushin.tictactoe.core.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import io.karniushin.tictactoe.core.controller.view.*;
import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.service.GameService;
import io.karniushin.tictactoe.core.service.PlayerRegistry;

@RestController
@RequestMapping(path = "/api/v1/tictac")
public class TicTacGameController {

    private final GameService gameService;

    private final PlayerRegistry playerRegistry;

    @Autowired
    public TicTacGameController(GameService gameService, PlayerRegistry playerRegistry) {
        this.gameService = gameService;
        this.playerRegistry = playerRegistry;
    }

    @PostMapping("/create")
    public CreatedGameView createNewGame(@RequestBody CreateGameRequest createRequest) {
        GameSession session = gameService.newGame(createRequest.getUsername(), createRequest.getGameName(), createRequest.getThreshold(), createRequest.isX());
        return new CreatedGameView(session.getId(), session.getOwnerId());
    }

    @PutMapping("/{gameId}/connect/{username}")
    public ConnectedGameView connectToGame(@PathVariable UUID gameId, @PathVariable String username) {
        GameSession session = gameService.connect(gameId, username);
        return new ConnectedGameView(session.getOpponentId(), !session.isOwnerX());
    }

    @PutMapping(value = "/turn")
    @ResponseStatus(HttpStatus.OK)
    public void makeTurn(@RequestBody TurnRequest turnRequest) {
        gameService.makeTurn(turnRequest.getGameId(), turnRequest.getPlayerId(), turnRequest.getX(), turnRequest.getY());
    }

    @GetMapping(value = "/list")
    public List<GameSessionView> listGames() {
        List<GameSession> sessions = gameService.list();
        return sessions.stream().map(s -> {
            GameSessionView g = new GameSessionView(s.getId(), s.getName(), s.getStatus(), s.getThreshold(), s.getLastTurnDate());
            g.setOwner(playerRegistry.getNameById(s.getOwnerId()));
            return g;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{gameId}/{playerId}")
    public GameStateView state(@PathVariable UUID gameId, @PathVariable UUID playerId) {
        GameSession session = gameService.getGame(gameId);
        boolean isOwner = session.isOwner(playerId);
        return new GameStateView(
            session.getName(), session.getBoard(), !session.canMakeTurn(playerId), session.getStatus(), session.getWin(), isOwner,
                playerRegistry.getNameById(playerId), isOwner == session.isOwnerX()
        );
    }

    @GetMapping("/{gameId}")
    public GameStatusView status(@PathVariable UUID gameId) {
        GameSession session = gameService.getGame(gameId);
        return new GameStatusView(playerRegistry.getNameById(session.getOwnerId()), session.getName(), session.getStatus());
    }
}
