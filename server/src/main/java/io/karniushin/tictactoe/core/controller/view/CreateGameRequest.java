package io.karniushin.tictactoe.core.controller.view;

public class CreateGameRequest {

    private String username;

    private int threshold;

    private boolean x;

    private String gameName;

    public CreateGameRequest() {
    }

    public CreateGameRequest(final String username, final int threshold, final boolean x, final String gameName) {
        this.username = username;
        this.threshold = threshold;
        this.x = x;
        this.gameName = gameName;
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

    public String getGameName() {
        return gameName;
    }
}
