import PropTypes from 'prop-types';

export const GameStatuses = {
    WAITING: 'WAITING_FOR_OPPONENT',
    ACTIVE: 'IN_PROGRESS',
    FINISHED: 'FINISHED'
};

export const WaitStatuses = {
    OWNER: 'OWNER',
    OPPONENT: 'OPPONENT',
};

export const GameSession = PropTypes.shape({
    gameId: PropTypes.string.isRequired,
    owner: PropTypes.string,
    status: PropTypes.oneOf(Object.values(GameStatuses)),
    threshold: PropTypes.number,
    lastTurn: PropTypes.number
});

const Coord = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
});

export const WinResult = PropTypes.shape({
    type: PropTypes.oneOf(["X", "Y", "D"]).isRequired,
    who: PropTypes.number.isRequired,
    seq: PropTypes.arrayOf(Coord).isRequired
});

export const Error = PropTypes.shape({
    msg: PropTypes.string,
    status: PropTypes.number
});

export const SessionInfo = PropTypes.shape({
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired),
    gameName: PropTypes.string,
    isOwner: PropTypes.bool.isRequired,
    lastTurn: PropTypes.number,
    playerName: PropTypes.string,
    shouldWait: PropTypes.bool.isRequired,
    status: PropTypes.oneOf(Object.values(GameStatuses)),
    threshold: PropTypes.number.isRequired,
    win: WinResult,
    x: PropTypes.bool.isRequired
})
