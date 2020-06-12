import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Alert, Col, Divider, Rate, Row, Spin} from 'antd';

import {Error, GameStatuses, SessionInfo} from '../../app.types';
import "./game-board.component.scss";
import {isFinished, isInProgress, isWaiting} from "../../app.utils";
import ErrorPanel from "../error-panel.component";
import GameOver from "./game-over.component";
import TurnHint from "./turn-hint.component";
import Grid from "./grid.component";
import Wait from "./wait.component";

const intro = (gameName, status) => {
    switch (status) {
        case GameStatuses.FINISHED:
            return `[${gameName}] has been finished.`;
        case GameStatuses.ACTIVE:
            return `[${gameName}] has begun.`;
        default:
            return '';
    }
}

const GameBoardComponent = ({error, loading, session, gameId, onRefresh, onTurn, onInit, playerId,
                                session: {gameName, isOwner, playerName, shouldWait, status, threshold}}) => {

    useEffect(() => {
        if (!error.status) {
            onInit(gameId, playerId);
        }
    }, [gameId, playerId]);

    return <div className='game-board'>
        {error.status && <ErrorPanel status={error.status} msg={error.msg} onReload={() => onRefresh(gameId, playerId)}/>}
        {!error.status && <Spin tip="Loading game data..." spinning={loading}>
            {status && <>
                {isWaiting(status) && <Wait gameId={gameId}
                                            gameName={gameName}
                                            onRefresh={onRefresh}
                                            playerId={playerId}
                                            playerName={playerName}
                                            threshold={threshold}/>}
                {!isWaiting(status) && <>
                    <>
                        <Alert message={`Hi ${playerName}! ${intro(gameName, status)}`} type="success" />
                        <Rate className='rate-threshold' count={10} defaultValue={threshold} disabled={true} />
                    </>
                    <Divider/>
                    {isFinished(status) && <GameOver isOwner={isOwner} win={session.win}/>}
                    {isInProgress(status) && <TurnHint shouldWait={shouldWait} gameId={gameId} playerId={playerId} onRefresh={onRefresh}/>}
                    <Spin tip="Waiting..." size="large" spinning={isInProgress(status) && shouldWait}>
                        <div className='wrapper'>
                            <Row gutter={[16, 16]}>
                                <Col span={3}>
                                    <img className='hero sc' alt={'Scorpion'} src={'/sc.png'}/>
                                </Col>
                                <Col span={18}>
                                    <Grid playerId={playerId}
                                          gameId={gameId}
                                          onTurn={onTurn}
                                          session={session}/>
                                </Col>
                                <Col span={3} style={{marginLeft: '-30px'}}>
                                    <img className='hero sz' alt={'Sub Zero'} src={'/sz.png'}/>
                                </Col>
                            </Row>
                        </div>
                    </Spin>
                </>}
            </>}
        </Spin>
        }
    </div>
}

GameBoardComponent.propTypes = {
    error: Error,
    gameId: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    onInit: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onTurn: PropTypes.func.isRequired,
    playerId: PropTypes.string.isRequired,
    session: SessionInfo
};

export default GameBoardComponent;
