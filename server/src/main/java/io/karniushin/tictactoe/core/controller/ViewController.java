package io.karniushin.tictactoe.core.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    private static final String UUID_RE = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

    @RequestMapping(value = "/{gameId:" + UUID_RE + "}/{playerId:" + UUID_RE + "}")
    public String index() {
        return "forward:/";
    }
}
