package io.karniushin.tictactoe.core.service.handler.rule.condition;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import io.karniushin.tictactoe.core.domain.WinResult;

public abstract class WinCondition {

    protected WinResult.WinResultType type;

    public WinResult check(final CheckParams params) {
        final short search = params.getSearch();
        final int threshold = params.getThreshold();
        List<WinResult.Coords> winningLine = new ArrayList<>();
        winningLine.add(new WinResult.Coords(params.getX(), params.getY()));

        NeighbourDetector before = before(params);
        while (before.hasNext()) {
            winningLine.add(0, before.next());
            if (winningLine.size() == threshold) {
                return new WinResult(type, search, winningLine);
            }
        }
        NeighbourDetector after = after(params);
        while (after.hasNext()) {
            winningLine.add(after.next());
            if (winningLine.size() == threshold) {
                return new WinResult(type, search, winningLine);
            }
        }
        return null;
    }

    protected abstract NeighbourDetector before(CheckParams params);

    protected abstract NeighbourDetector after(CheckParams params);

    protected abstract static class NeighbourDetector implements Iterator<WinResult.Coords> {

        private final short[][] board;
        private final short search;

        public NeighbourDetector(short[][] board, short search) {
            this.board = board;
            this.search = search;
        }

        protected boolean matches(int i, int j) {
            return board[i][j] == search;
        }
    }
}
