package io.karniushin.tictactoe.core.controller.view;

public class CreateGameRequest {

    private String username;

    private int threshold;

    private boolean x;

    private String boardname;

    public CreateGameRequest() {
    }

    public CreateGameRequest(final String username, final int threshold, final boolean x) {
        this.username = username;
        this.threshold = threshold;
        this.x = x;
    }

    public CreateGameRequest(final String username, final int threshold, final boolean x, final String boardname) {
        this(username, threshold, x);
        this.boardname = boardname;
    }

    public String getUsername() {
        return username;
    }

    public int getThreshold() {
        return threshold;
    }

    public boolean isX() {
        return x;
    }

    public String getBoardname() {
        return boardname;
    }
}
