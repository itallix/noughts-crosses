package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class VerticalWin extends WinCondition {

    public VerticalWin() {
        this.type = WinResult.WinResultType.Y;
    }

    @Override
    protected WinIterator before(final int x, final int y, final short[][] board, final short search) {
        return new Before(x, y, board, search);
    }

    @Override
    protected WinIterator after(final int x, final int y, final short[][] board, final short search) {
        return new After(x, y, board, search);
    }

    private static class Before extends WinIterator {

        private final int y;
        private int i;

        public Before(int x, int y, short[][] board, short search) {
            super(board, search);
            this.y = y;
            this.i = x - 1;
        }

        @Override
        public boolean hasNext() {
            return y >= 0 && i >= 0 && board[i][y] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(i--, y);
        }
    }

    private static class After extends WinIterator {

        private final int y;
        private int i;

        public After(int x, int y, short[][] board, short search) {
            super(board, search);
            this.y = y;
            this.i = x + 1;
        }

        @Override
        public boolean hasNext() {
            return y < BOARD_DIMENSION && i < BOARD_DIMENSION && board[i][y] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(i++, y);
        }
    }
}
