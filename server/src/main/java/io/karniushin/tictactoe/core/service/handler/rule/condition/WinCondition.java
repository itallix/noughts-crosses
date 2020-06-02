package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

public interface WinCondition {

    WinResult check(CheckParams params);
}
