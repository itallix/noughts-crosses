package io.karniushin.tictactoe.core.service;

import java.util.UUID;
import org.junit.After;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import io.karniushin.tictactoe.core.domain.Player;

import static io.karniushin.tictactoe.core.service.PlayerRegistryImpl.PLAYER_UNKNOWN;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith( SpringRunner.class )
@SpringBootTest
public class PlayerRegistryTests {

    @Autowired
    private PlayerRegistry playerRegistry;

    @After
    public void onAfter() {
        playerRegistry.reset();
    }

    @Test
    public void shouldRegisterPlayer() {
        Player player = playerRegistry.registerPlayer("Alex");
        assertEquals(player.getUsername(), "Alex");
        assertNotNull(player.getId());
    }

    @Test
    public void shouldReturnUnknownNameForNotRegisteredId() {
        assertEquals(playerRegistry.getNameById(UUID.randomUUID()), PLAYER_UNKNOWN);
    }

    @Rule
    public final ExpectedException expectedEx = ExpectedException.none();

    @Test
    public void shouldNotRegisterPlayersWithExistingName() {
        playerRegistry.registerPlayer("Alex");
        expectedEx.expect(IllegalArgumentException.class);
        expectedEx.expectMessage(String.format(PlayerRegistryImpl.PLAYER_EXISTS, "Alex"));
        playerRegistry.registerPlayer("Alex");
    }
}
