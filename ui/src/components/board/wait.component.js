import React from 'react';
import PropTypes from 'prop-types';
import {Button, Popover, Result} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';


const Wait = ({gameId, onRefresh, playerId, gameName, playerName, threshold}) => {
    const url = window.location.href;

    return (<Result
        status="success"
        title={`Hi ${playerName}! You've just successfully created the new game with name [${gameName}] and threshold ${threshold}`}
        subTitle={`Game id: ${gameId}. Please wait for opponent to join the game.`}
        extra={[
            <CopyToClipboard key="copy" text={url.substring(0, url.lastIndexOf("/"))}>
                <Popover trigger="click" content={<span>Game link copied!</span>}>
                    <Button type="dashed" key="copy">
                        Copy Link
                    </Button>
                </Popover>
            </CopyToClipboard>,
            <Button key="refresh" type="primary" onClick={() => onRefresh(gameId, playerId)}>
                Refresh
            </Button>
        ]}
    />);
};

Wait.propTypes = {
    gameId: PropTypes.string.isRequired,
    gameName: PropTypes.string.isRequired,
    onRefresh: PropTypes.func.isRequired,
    playerId: PropTypes.string.isRequired,
    playerName: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired
};

export default Wait;
