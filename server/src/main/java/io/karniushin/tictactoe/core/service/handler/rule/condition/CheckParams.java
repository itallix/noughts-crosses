package io.karniushin.tictactoe.core.service.handler.rule.condition;

public class CheckParams {

    private final short[][] board;

    private final short search;

    private final int x;

    private final int y;

    private final int threshold;

    public CheckParams(final short[][] board, final short search, final int x, final int y, final int threshold) {
        this.board = board;
        this.search = search;
        this.x = x;
        this.y = y;
        this.threshold = threshold;
    }

    public short[][] getBoard() {
        return board;
    }

    public short getSearch() {
        return search;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getThreshold() {
        return threshold;
    }
}
