package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class PrincipalWin extends WinCondition {

    public PrincipalWin() {
        this.type = WinResult.WinResultType.D;
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

        private int i;
        private int j;
        private final int x;
        private final int y;

        public Before(int x, int y, short[][] board, short search) {
            super(board, search);
            this.x = x;
            this.y = y;
            this.i = x - 1;
            this.j = y - 1;
        }

        @Override
        public boolean hasNext() {
            return x > 0 && y > 0 && i >= 0 && j >= 0 && board[i][j] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(i--, j--);
        }
    }

    private static class After extends WinIterator {

        private int i;
        private int j;
        private final int x;
        private final int y;

        public After(int x, int y, short[][] board, short search) {
            super(board, search);
            this.x = x;
            this.y = y;
            this.i = x + 1;
            this.j = y + 1;
        }

        @Override
        public boolean hasNext() {
            return x < BOARD_DIMENSION && y < BOARD_DIMENSION && i < BOARD_DIMENSION && j < BOARD_DIMENSION && board[i][j] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(i++, j++);
        }
    }
}
