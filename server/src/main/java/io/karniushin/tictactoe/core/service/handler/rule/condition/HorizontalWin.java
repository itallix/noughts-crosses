package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class HorizontalWin extends WinCondition {

    public HorizontalWin() {
        this.type = WinResult.WinResultType.X;
    }

    @Override
    protected NeighbourDetector before(CheckParams params) {
        return new NeighbourDetector(params.getBoard(), params.getSearch()) {

            final int x = params.getX();
            int i = params.getY() - 1;

            @Override
            public boolean hasNext() {
                return x >= 0 && i >= 0 && matches(x, i);
            }

            @Override
            public WinResult.Coords next() {
                return new WinResult.Coords(x, i--);
            }
        };
    }

    @Override
    protected NeighbourDetector after(CheckParams params) {
        return new NeighbourDetector(params.getBoard(), params.getSearch()) {

            final int x = params.getX();
            int i = params.getY() + 1;

            @Override
            public boolean hasNext() {
                return x < BOARD_DIMENSION && i < BOARD_DIMENSION && matches(x, i);
            }

            @Override
            public WinResult.Coords next() {
                return new WinResult.Coords(x, i++);
            }
        };
    }
}
