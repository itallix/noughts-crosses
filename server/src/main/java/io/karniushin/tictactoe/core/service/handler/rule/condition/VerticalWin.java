package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class VerticalWin extends WinCondition {

    public VerticalWin() {
        this.type = WinResult.WinResultType.Y;
    }

    @Override
    protected NeighbourDetector before(CheckParams params) {
        return new NeighbourDetector(params.getBoard(), params.getSearch()) {

            final int y = params.getY();
            int i = params.getX() - 1;

            @Override
            public boolean hasNext() {
                return y >= 0 && i >= 0 && matches(i, y);
            }

            @Override
            public WinResult.Coords next() {
                return new WinResult.Coords(i--, y);
            }
        };
    }

    @Override
    protected NeighbourDetector after(CheckParams params) {
        return new NeighbourDetector(params.getBoard(), params.getSearch()) {

            final int y = params.getY();
            int i = params.getX() + 1;

            @Override
            public boolean hasNext() {
                return y < BOARD_DIMENSION && i < BOARD_DIMENSION && matches(i, y);
            }

            @Override
            public WinResult.Coords next() {
                return new WinResult.Coords(i++, y);
            }
        };
    }
}
