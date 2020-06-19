package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class PrincipalWin extends WinCondition {

    public PrincipalWin() {
        this.type = WinResult.WinResultType.D;
    }

    @Override
    protected NeighbourDetector before(CheckParams params) {
        return new NeighbourDetector(params.getBoard(), params.getSearch()) {

            final int x = params.getX();
            final int y = params.getY();
            int i = x - 1;
            int j = y - 1;

            @Override
            public boolean hasNext() {
                return x > 0 && y > 0 && i >= 0 && j >= 0 && matches(i, j);
            }

            @Override
            public WinResult.Coords next() {
                return new WinResult.Coords(i--, j--);
            }
        };
    }

    @Override
    protected NeighbourDetector after(CheckParams params) {
        return new NeighbourDetector(params.getBoard(), params.getSearch()) {

            final int x = params.getX();
            final int y = params.getY();
            int i = x + 1;
            int j = y + 1;

            @Override
            public boolean hasNext() {
                return x < BOARD_DIMENSION && y < BOARD_DIMENSION && i < BOARD_DIMENSION && j < BOARD_DIMENSION && matches(i, j);
            }

            @Override
            public WinResult.Coords next() {
                return new WinResult.Coords(i++, j++);
            }
        };
    }
}
