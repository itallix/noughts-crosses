package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class SecondaryWin extends WinCondition {

    public SecondaryWin() {
        this.type = WinResult.WinResultType.D;
    }

    @Override
    protected NeighbourDetector before(final int x, final int y, final short[][] board, final short search) {
        return new Before(x, y, board, search);
    }

    @Override
    protected NeighbourDetector after(final int x, final int y, final short[][] board, final short search) {
        return new After(x, y, board, search);
    }

    private static class Before extends NeighbourDetector {

        private int i;
        private int j;
        private final int x;
        private final int y;

        public Before(int x, int y, short[][] board, short search) {
            super(board, search);
            this.x = x;
            this.y = y;
            this.i = x - 1;
            this.j = y + 1;
        }

        @Override
        public boolean hasNext() {
            return x > 0 && y < BOARD_DIMENSION && i >= 0 && j < BOARD_DIMENSION && board[i][j] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(i--, j++);
        }
    }

    private static class After extends NeighbourDetector {

        private int i;
        private int j;
        private final int x;
        private final int y;

        public After(int x, int y, short[][] board, short search) {
            super(board, search);
            this.x = x;
            this.y = y;
            this.i = x + 1;
            this.j = y - 1;
        }

        @Override
        public boolean hasNext() {
            return x < BOARD_DIMENSION && y > 0 && i < BOARD_DIMENSION && j >= 0 && board[i][j] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(i++, j--);
        }
    }
}
