package io.karniushin.tictactoe.core.domain;

import java.util.List;
import java.util.Objects;

public class WinResult {

    private final WinResultType type;

    private final short who;

    private final List<Coords> seq;

    public WinResult(WinResultType type, short who, List<Coords> seq) {
        this.type = type;
        this.who = who;
        this.seq = seq;
    }

    public WinResultType getType() {
        return type;
    }

    public int getWho() {
        return who;
    }

    public List<Coords> getSeq() {
        return seq;
    }

    public enum WinResultType { X, Y, D }

    public static class Coords {

        private final int x;

        private final int y;

        public Coords(final int x, final int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }

        @Override
        public boolean equals(final Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            final Coords coords = (Coords) o;
            return x == coords.x &&
                    y == coords.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }
    }
}
