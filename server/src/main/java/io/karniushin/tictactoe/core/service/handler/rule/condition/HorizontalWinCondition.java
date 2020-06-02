package io.karniushin.tictactoe.core.service.handler.rule.condition;

import java.util.stream.Collectors;
import java.util.stream.IntStream;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class HorizontalWinCondition implements WinCondition {

    @Override
    public WinResult check(CheckParams params) {
        short[][] board = params.getBoard();
        int x = params.getX();
        int y = params.getY();
        byte count = 1;
        final int threshold = params.getThreshold();
        final short search = params.getSearch();
        for (int i = y - 1; x >= 0 && i >= 0 && board[x][i] == search; i--) {
            if (++count == threshold) {
                return new WinResult(
                    WinResult.WinResultType.X, search,
                    IntStream.rangeClosed(i, i + threshold - 1)
                        .mapToObj(n -> new WinResult.Coords(x, n))
                        .collect(Collectors.toList())
                );
            }
        }
        for (int i = y + 1; x < BOARD_DIMENSION && i < BOARD_DIMENSION && board[x][i] == search; i++) {
            if (++count == threshold) {
                return new WinResult(
                    WinResult.WinResultType.X, search,
                        IntStream.rangeClosed(i - threshold + 1, i)
                                .mapToObj(n -> new WinResult.Coords(x, n))
                                .collect(Collectors.toList())
                );
            }
        }
        return null;
    }
}
