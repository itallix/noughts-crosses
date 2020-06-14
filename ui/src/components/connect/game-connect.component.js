import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Result, Spin} from 'antd';
import {Link} from 'react-router-dom';

import {Error, GameStatuses} from '../../app.types';
import ErrorPanel from "../error-panel.component";
import Invite from "./invite.component";
import {isWaiting} from "../../app.utils";

const GameConnectComponent = ({error, loading, gameId, gameName, onConnect, onInit, playerName, status, threshold}) => {
    useEffect(() => {
        onInit(gameId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameId]);

    const [valid, setValid] = useState(false);
    const [username, setUsername] = useState("");

    const titles = {
        [GameStatuses.FINISHED]: "You cannot join this game because it has been already finished",
        [GameStatuses.ACTIVE]: "You cannot join the game that's being in progress"
    };

    return <Spin tip="Loading..." spinning={loading}>
        {!loading && <>
            <ErrorPanel status={error.status} msg={error.msg} onReload={() => onInit(gameId)}/>
            {!error.status && status && <>
                {isWaiting(status) &&
                <Invite valid={valid} game={gameName} player={playerName}
                        onConnect={() => onConnect(gameId, username)}
                        onUsernameChange={username => {
                            setValid(username.length > 0 && username !== playerName);
                            setUsername(username);
                        }}
                        threshold={threshold}
                />}
                {!isWaiting(status) && <Result
                    title={titles[status] || "You cannot join the game with unknown status"}
                    extra={
                        <Button type="dashed"><Link to={"/"}>Dashboard</Link></Button>
                    }
                />}
            </>}
        </>}
    </Spin>
}

GameConnectComponent.propTypes = {
    error: Error,
    gameId: PropTypes.string.isRequired,
    playerName: PropTypes.string,
    gameName: PropTypes.string,
    status: PropTypes.oneOf(Object.values(GameStatuses)),
    onConnect: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired
};

export default GameConnectComponent;
