package io.karniushin.tictactoe.core.service.handler.rule.condition;

import io.karniushin.tictactoe.core.domain.WinResult;

import static io.karniushin.tictactoe.core.domain.GameSession.BOARD_DIMENSION;

public class HorizontalWin extends WinCondition {

    public HorizontalWin() {
        this.type = WinResult.WinResultType.X;
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

        private final int x;
        private int i;

        public Before(int x, int y, short[][] board, short search) {
            super(board, search);
            this.x = x;
            this.i = y - 1;
        }

        @Override
        public boolean hasNext() {
            return x >= 0 && i >= 0 && board[x][i] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(x, i--);
        }
    }

    private static class After extends WinIterator {

        private final int x;
        private int i;

        public After(int x, int y, short[][] board, short search) {
            super(board, search);
            this.x = x;
            this.i = y + 1;
        }

        @Override
        public boolean hasNext() {
            return x < BOARD_DIMENSION && i < BOARD_DIMENSION && board[x][i] == search;
        }

        @Override
        public WinResult.Coords next() {
            return new WinResult.Coords(x, i++);
        }
    }
}
