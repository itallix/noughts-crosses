package io.karniushin.tictactoe.core.service.handler.rule.condition;

import java.util.ArrayList;
import java.util.List;

import io.karniushin.tictactoe.core.domain.WinResult;

public abstract class WinCondition {

    protected WinResult.WinResultType type;
    protected List<WinResult.Coords> winningLine;

    public WinResult check(final CheckParams params) {
        int x = params.getX();
        int y = params.getY();
        winningLine = new ArrayList<>();
        winningLine.add(new WinResult.Coords(x, y));
        return detectWinner(x, y, params.getBoard(), params.getSearch(), params.getThreshold());
    }

    protected abstract WinResult detectWinner(int x, int y, short[][] board, short search, int threshold);

    protected WinResult winner(short search) {
        return new WinResult(type, search, winningLine);
    }

    protected boolean thresholdReached(int threshold) {
        return winningLine.size() == threshold;
    }
}
