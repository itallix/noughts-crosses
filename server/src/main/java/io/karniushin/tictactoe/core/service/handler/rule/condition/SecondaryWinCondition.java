package io.karniushin.tictactoe.core.service.handler.rule.condition;

import java.util.ArrayList;
import java.util.List;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class SecondaryWinCondition implements WinCondition {

    @Override
    public WinResult check(final CheckParams params) {
        short[][] board = params.getBoard();
        int x = params.getX();
        int y = params.getY();
        byte count = 1;
        final short search = params.getSearch();
        final int threshold = params.getThreshold();
        List<WinResult.Coords> line = new ArrayList<>();
        line.add(new WinResult.Coords(x, y));
        if (x > 0 && y < BOARD_DIMENSION) {
            for (int i = x - 1, j = y + 1; i >= 0 && j < BOARD_DIMENSION && board[i][j] == search; i--, j++) {
                line.add(0, new WinResult.Coords(i, j));
                if (++count == threshold) {
                    return new WinResult(WinResult.WinResultType.D, search, line);
                }
            }
        }
        if (x < BOARD_DIMENSION && y > 0) {
            for (int i = x + 1, j = y - 1; i < BOARD_DIMENSION && j >= 0 && board[i][j] == search; i++, j--) {
                line.add(new WinResult.Coords(i, j));
                if (++count == threshold) {
                    return new WinResult(WinResult.WinResultType.D, search, line);
                }
            }
        }
        return null;
    }
}
