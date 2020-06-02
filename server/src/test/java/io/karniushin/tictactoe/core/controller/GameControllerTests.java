package io.karniushin.tictactoe.core.controller;

import java.util.UUID;
import java.util.stream.IntStream;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.JUnitRestDocumentation;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.karniushin.tictactoe.core.controller.view.CreatedGameView;
import io.karniushin.tictactoe.core.controller.view.TurnRequest;
import io.karniushin.tictactoe.core.domain.GameSession;
import io.karniushin.tictactoe.core.domain.GameStatus;
import io.karniushin.tictactoe.core.domain.WinResult;
import io.karniushin.tictactoe.core.service.GameService;
import io.karniushin.tictactoe.core.support.Fixtures;

import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.ANOTHER_PLAYER;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.BUSY;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.NOT_IN_RANGE;
import static io.karniushin.tictactoe.core.service.handler.rule.DefaultTurnRule.NOT_REGISTERED;
import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@ActiveProfiles("test")
@SpringBootTest
public class GameControllerTests {

    @Rule
    public JUnitRestDocumentation restDocumentation = new JUnitRestDocumentation("build/snippets");

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private Fixtures fixtures;

    @Autowired
    private GameService gameService;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Before
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
                .apply(documentationConfiguration(this.restDocumentation))
                .build();
    }

    @Test
    public void shouldCreateNewGame() throws Exception {
        String response = this.mockMvc.perform(post("/api/v1/tictac/{username}/{threshold}", "Vitalii", 5))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("create", preprocessResponse(prettyPrint()),
                        responseFields(fieldWithPath("gameId")
                                        .description("Identifies the game session")
                                        .type(JsonFieldType.STRING),
                                fieldWithPath("ownerId")
                                        .description("Identifies current player")
                                        .type(JsonFieldType.STRING)
                        )
                ))
                .andReturn().getResponse().getContentAsString();

        CreatedGameView view = objectMapper.readValue(response, CreatedGameView.class);
        GameSession session = gameService.getGame(view.getGameId());
        assertNotNull(session);
        assertTrue(session.isWaiting());
    }

    @Test
    public void shouldConnectToNewGame() throws Exception {
        UUID gameId = fixtures.initialSetupWithoutOpponent();
        this.mockMvc.perform(put("/api/v1/tictac/{gameId}/connect/{username}", gameId, "Evgeniy"))
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("connect", preprocessResponse(prettyPrint())
        ));
        GameSession session = gameService.getGame(gameId);
        assertTrue(session.isInProgress());
        assertNotNull(session.getOpponentId());
    }

    @Test
    public void shouldFailToConnectIfGameDoesntExist() throws Exception {
        UUID gameId = UUID.randomUUID();
        this.mockMvc.perform(put("/api/v1/tictac/{gameId}/connect/{username}", gameId, "Robert"))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().string(equalTo(format("Game with id [%s] doesn't exist", gameId))))
                .andDo(document("connect/doesNotExist", preprocessResponse(prettyPrint())));
    }

    @Test
    public void shouldFailToConnectIfOpponentIsThere() throws Exception {
        UUID gameId = fixtures.initialSetup();
        this.mockMvc.perform(put("/api/v1/tictac/{gameId}/connect/{username}", gameId, "Robert"))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(equalTo(format("Opponent for the game with id [%s] has been already registered", gameId))))
                .andDo(document("connect/opponentRegistered", preprocessResponse(prettyPrint())));
    }

    @Test
    public void shouldMakeTurnAndFinishGame() throws Exception {
        UUID gameId = fixtures.ownerEndGameHorizontalSetup();
        GameSession session = gameService.getGame(gameId);
        UUID ownerId = session.getOwnerId();
        this.mockMvc.perform(put("/api/v1/tictac/turn")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new TurnRequest(gameId, ownerId, 0, 9))))
                .andDo(print()).andExpect(status().isOk())
                .andDo(document("turn", preprocessResponse(prettyPrint())));
        session = gameService.getGame(gameId);
        assertTrue(session.isFinished());
        WinResult result = session.getWin();
        assertEquals(result.getType(), WinResult.WinResultType.X);
        assertEquals(result.getWho(), 1);
        assertEquals(result.getSeq(), IntStream.range(0, 10).mapToObj(n -> new WinResult.Coords(0, n)).collect(toList()));
    }

    @Test
    public void shouldFailTurnWithWrongPosition() throws Exception {
        UUID gameId = fixtures.ownerEndGameHorizontalSetup();
        GameSession session = gameService.getGame(gameId);
        UUID ownerId = session.getOwnerId();

        this.mockMvc.perform(put("/api/v1/tictac/turn")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new TurnRequest(gameId, ownerId, 7, 11))))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(equalTo(NOT_IN_RANGE)))
                .andDo(document("turn/notInRange", preprocessResponse(prettyPrint())));
    }

    @Test
    public void shouldFailTurnWithOccupiedPosition() throws Exception {
        UUID gameId = fixtures.ownerEndGameHorizontalSetup();
        GameSession session = gameService.getGame(gameId);
        UUID ownerId = session.getOwnerId();

        this.mockMvc.perform(put("/api/v1/tictac/turn")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new TurnRequest(gameId, ownerId, 0, 0))))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(equalTo(BUSY)))
                .andDo(document("turn/busy", preprocessResponse(prettyPrint())));
    }

    @Test
    public void shouldFailTurnWithNonRegisteredUserId() throws Exception {
        UUID gameId = fixtures.initialSetup();

        this.mockMvc.perform(put("/api/v1/tictac/turn")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new TurnRequest(gameId, UUID.randomUUID(), 3, 7))))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(equalTo(NOT_REGISTERED)))
                .andDo(document("turn/nonRegistered", preprocessResponse(prettyPrint())));
    }

    @Test
    public void shouldFailTurnWhenAnotherPlayersTurn() throws Exception {
        UUID gameId = fixtures.turnDisbalanceSetup();
        GameSession session = gameService.getGame(gameId);
        UUID opponentId = session.getOpponentId();

        this.mockMvc.perform(put("/api/v1/tictac/turn")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new TurnRequest(gameId, opponentId, 3, 4))))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(equalTo(ANOTHER_PLAYER)))
                .andDo(document("turn/anotherPlayer", preprocessResponse(prettyPrint())));
    }

    @Test
    public void shouldListGames() throws Exception {
        gameService.clean();
        GameSession session = gameService.newGame("Dennis", 10);

        this.mockMvc.perform(get("/api/v1/tictac/list")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[0].['gameId']", is(session.getId().toString())))
                .andExpect(jsonPath("$.[0].['owner']", is("Dennis")))
                .andExpect(jsonPath("$.[0].['status']", is(GameStatus.WAITING_FOR_OPPONENT.toString())))
                .andDo(print()).andExpect(status().isOk())
                .andDo(document("load/list", preprocessResponse(prettyPrint()),
                        responseFields(fieldWithPath("[]")
                                .description("List of registered games").type(JsonFieldType.ARRAY))
                                .andWithPrefix("[].",
                                        fieldWithPath("gameId")
                                                .description("Game unique identifier")
                                                .type(JsonFieldType.STRING),
                                        fieldWithPath("owner")
                                                .description("Name of the player who owns the game session")
                                                .type(JsonFieldType.STRING),
                                        fieldWithPath("status")
                                                .description("Current status of the game [WAITING_FOR_OPPONENT; IN_PROGRESS; FINISHED]")
                                                .type(JsonFieldType.STRING),
                                        fieldWithPath("threshold")
                                                .description("How many symbols should be sequentially in line to win")
                                                .type(JsonFieldType.NUMBER),
                                        fieldWithPath("lastTurn")
                                                .description("Timestamp in milliseconds when the last turn has been made")
                                                .type(JsonFieldType.NUMBER)
                                )
                        )
                );
    }

    @Test
    public void shouldGetGame() throws Exception {
        UUID gameId = fixtures.ownerEndGameHorizontalSetup();
        GameSession session = gameService.getGame(gameId);
        gameService.makeTurn(session.getId(), session.getOwnerId(), 0, 9);

        this.mockMvc.perform(get("/api/v1/tictac/{gameId}/{playerId}", session.getId(), session.getOwnerId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$['board']", hasSize(10)))
                .andExpect(jsonPath("$['board'][0]", hasSize(10)))
                .andExpect(jsonPath("$['board'][9]", hasSize(10)))
                .andExpect(jsonPath("$['board'][0][0]", is(1)))
                .andExpect(jsonPath("$['shouldWait']", is(true)))
                .andExpect(jsonPath("$['status']", is(GameStatus.FINISHED.toString())))
                .andExpect(jsonPath("$['win']['type']", is(WinResult.WinResultType.X.toString())))
                .andExpect(jsonPath("$['win']['who']", is(1)))
                .andDo(print()).andExpect(status().isOk())
                .andDo(document("load/get", preprocessResponse(prettyPrint()),
                        responseFields(fieldWithPath("board[][]")
                                .description("2D array that represents game board")
                                .type(JsonFieldType.ARRAY),
                        fieldWithPath("shouldWait")
                                .description("If the player should wait for another player's turn")
                                .type(JsonFieldType.BOOLEAN),
                        fieldWithPath("status")
                                .description("Current status of the game [WAITING_FOR_OPPONENT; IN_PROGRESS; FINISHED]")
                                .type(JsonFieldType.STRING),
                        fieldWithPath("win")
                                .optional()
                                .description("Metadata indicating winner combination")
                                .type(JsonFieldType.OBJECT),
                        fieldWithPath("win.type")
                                .description("Type of winning combination [X; Y; D] where X - horizontal, Y - vertical, D - diagonal")
                                .type(JsonFieldType.STRING),
                        fieldWithPath("win.who")
                                .description("Win symbol [1; -1] where 1 indicates owner, and -1 - opponent")
                                .type(JsonFieldType.NUMBER),
                        fieldWithPath("win.seq[]")
                                .description("Winning combination represented by sequence of coordinates (x; y)")
                                .type(JsonFieldType.ARRAY),
                        fieldWithPath("win.seq[].x")
                                .ignored(),
                        fieldWithPath("win.seq[].y")
                                .ignored()
                )));

    }
}
