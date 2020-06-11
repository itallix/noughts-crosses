package io.karniushin.tictactoe.core.support;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Profile("dev")
@Component
public class AutoDevDataFeed implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(AutoDevDataFeed.class);

    private final Fixtures fixtures;

    @Autowired
    public AutoDevDataFeed(Fixtures fixtures) {
        this.fixtures = fixtures;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        log.debug("Populating memory with game sessions...");
        fixtures.initialSetup();
        fixtures.initialSetupWithoutOpponent();
        fixtures.lastTurnSetup();
        log.debug("Game sessions has been added to internal memory");
    }
}
