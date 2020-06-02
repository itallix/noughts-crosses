package io.karniushin.tictactoe.core.service.handler.rule.condition;

import java.util.stream.Collectors;
import java.util.stream.IntStream;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class VerticalWinCondition implements WinCondition {

    @Override
    public WinResult check(final CheckParams params) {
        short[][] board = params.getBoard();
        int x = params.getX();
        int y = params.getY();
        byte count = 1;
        final short search = params.getSearch();
        final int threshold = params.getThreshold();
        for (int i = x - 1; y >= 0 && i >= 0 && board[i][y] == search; i--) {
            if (++count == threshold) {
                return new WinResult(
                        WinResult.WinResultType.Y, search,
                        IntStream.rangeClosed(i, i + threshold - 1)
                                .mapToObj(n -> new WinResult.Coords(n, y))
                                .collect(Collectors.toList())
                );
            }
        }
        for (int i = x + 1; y < BOARD_DIMENSION && i < BOARD_DIMENSION && board[i][y] == search; i++) {
            if (++count == threshold) {
                return new WinResult(
                        WinResult.WinResultType.Y, search,
                        IntStream.rangeClosed(i - threshold + 1, i)
                                .mapToObj(n -> new WinResult.Coords(n, y))
                                .collect(Collectors.toList())
                );
            }
        }
        return null;
    }
}
