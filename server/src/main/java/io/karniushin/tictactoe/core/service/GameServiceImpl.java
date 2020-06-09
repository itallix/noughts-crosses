package io.karniushin.tictactoe.core.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.locks.ReentrantLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.domain.Player;
import io.karniushin.tictactoe.core.ex.GameNotFoundException;
import io.karniushin.tictactoe.core.service.handler.TurnHandler;
import io.karniushin.tictactoe.core.service.msg.MessageSender;

import static java.lang.String.format;

@Service
public class GameServiceImpl implements GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameServiceImpl.class);

    private final ConcurrentMap<UUID, GameSession> games = new ConcurrentHashMap<>();

    private final Map<UUID, ReentrantLock> locks = new ConcurrentHashMap<>();

    private final TurnHandler turn;

    private final PlayerRegistry playerRegistry;

    private final MessageSender msgSender;

    @Autowired
    public GameServiceImpl(PlayerRegistry playerRegistry, MessageSender msgSender,
                           TurnHandler turn) {
        this.playerRegistry = playerRegistry;
        this.msgSender = msgSender;
        this.turn = turn;
    }

    @Override
    public GameSession newGame(String username, Integer threshold) {
        Player initiator = playerRegistry.registerPlayer(username);
        GameSession session = new GameSession(initiator.getId(), threshold);
        games.put(session.getId(), session);
        locks.put(session.getId(), new ReentrantLock());
        msgSender.notifyGameCreated(session);
        logger.debug("New game with id=[{}] started by player=[{}]", session.getId(), initiator);
        return session;
    }

    @Override
    public GameSession connect(UUID gameId, String username) {
        checkGameExists(gameId);
        ReentrantLock lock = locks.get(gameId);
        lock.lock();
        try {
            GameSession session = games.get(gameId);
            if (session.isWaiting()) {
                Player opponent = playerRegistry.registerPlayer(username);
                session.setOpponentId(opponent.getId());
                logger.debug("New user=[{}] connected to game with id=[{}]", opponent, session.getId());
                msgSender.notifyGameUpdated(session);
                return session;
            } else {
                throw new IllegalStateException(format("Opponent for the game with id [%s] has been already registered", session.getId()));
            }
        } finally {
            lock.unlock();
        }
    }

    @Override
    public GameSession makeTurn(UUID gameId, UUID playerId, Integer x, Integer y) {
        logger.debug("Processing turn [{}, {}] of the user=[{}] for game with id=[{}] ", x, y, playerId, gameId);
        checkGameExists(gameId);
        ReentrantLock lock = locks.get(gameId);
        lock.lock();
        GameSession session;
        try {
            session = games.get(gameId);
            turn.handle(session, playerId, x, y);
            msgSender.notifyGameUpdated(session);
        } finally {
            lock.unlock();
        }
        return session;
    }

    @Override
    public List<GameSession> list() {
        return new ArrayList<>(games.values());
    }

    private void checkGameExists(UUID gameId) {
        if (!games.containsKey(gameId)) {
            throw new GameNotFoundException(gameId);
        }
    }

    @Override
    public UUID addGame(GameSession gameSession) {
        games.put(gameSession.getId(), gameSession);
        locks.put(gameSession.getId(), new ReentrantLock());
        return gameSession.getId();
    }

    @Override
    public GameSession getGame(UUID gameId) {
        checkGameExists(gameId);
        return games.get(gameId);
    }

    @Override
    public void clean() {
        this.games.clear();
        this.locks.clear();
    }
}
