import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Alert, Button, Col, Divider, Result, Row, Spin} from 'antd';
import {CheckCircleOutlined, CloseOutlined} from '@ant-design/icons';

import {GameStatuses, WinResult} from '../app.types';
import "./game-board.component.scss";
import {isFinished, isInProgress, isWaiting} from "../app.utils";

export default class GameBoardComponent extends Component {

    static propTypes = {
        error: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        gameId: PropTypes.string.isRequired,
        playerId: PropTypes.string.isRequired,
        shouldWait: PropTypes.bool.isRequired,
        isOwner: PropTypes.bool.isRequired,
        onInit: PropTypes.func.isRequired,
        onRefresh: PropTypes.func.isRequired,
        onTurn: PropTypes.func.isRequired,
        board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired),
        playerName: PropTypes.string,
        status: PropTypes.oneOf(Object.values(GameStatuses)),
        win: WinResult
    };

    componentDidMount() {
        const {gameId, onInit, playerId} = this.props;
        onInit(gameId, playerId);
    }

    renderWaitingBlock() {
        const {gameId, onRefresh, playerId, playerName} = this.props;

        return (<Result
            status="success"
            title={`Hi ${playerName}! You've just successfully created the new game`}
            subTitle={`Game id: ${gameId}. Please wait for opponent to join the game.`}
            extra={[
                <Button type="primary" key="refresh" onClick={() => onRefresh(gameId, playerId)}>
                    Refresh
                </Button>
            ]}
        />);
    }

    renderGameOver() {
        const {isOwner, win} = this.props;

        return (<React.Fragment>
            <br/>
            {(isOwner && win.who === 1 || !isOwner && win.who === -1) &&
            <Alert
                message="Game is Over"
                description="Congratulations! You won the game! Refresh the browser window if you want to try your luck again."
                type="success"
                showIcon
            /> ||
            (!isOwner && win.who === 1 || isOwner && win.who === -1) &&
            <Alert
                message="Game is Over"
                description="You lost the game! Refresh the browser window if you want to try your luck again."
                type="error"
                showIcon
            />
            }
        </React.Fragment>)
    }

    renderTurnHint() {
        const {gameId, shouldWait, playerId, onRefresh} = this.props;

        return (<React.Fragment>
            {!shouldWait && <Alert
                message="Make a turn"
                description="Please feel free to make a turn."
                type="info"
                showIcon
            />}
            {shouldWait && <Alert
                message="Waiting for another turn"
                description="Wait until your opponent will make a turn."
                type="warning"
                showIcon/>
            }
            <Button className='refresh-btn' type='dashed' onClick={() => onRefresh(gameId, playerId)}>Refresh</Button>
        </React.Fragment>);
    }

    renderBoard() {
        const {board, gameId, isOwner, onTurn, playerId, status, shouldWait, win} = this.props;

        const isWinnerCell = (seq, r, c) => seq.find(p => p.x === r && p.y === c);

        return (<React.Fragment>
            {board.map((row, rdx) => (
                <Row key={rdx} gutter={[3, 3]}>
                    {row.map((num, idx) => {
                        const cellClasses = classNames('cell', {
                            'active': !shouldWait && row[idx] === 0 && isInProgress(status),
                            'winner': isFinished(status) && (isOwner && win.who === 1 || !isOwner && win.who === -1) &&
                                isWinnerCell(win.seq, rdx, idx),
                            'looser': isFinished(status) && (isOwner && win.who === -1 || !isOwner && win.who === 1) &&
                                isWinnerCell(win.seq, rdx, idx)
                        })
                        return (<Col key={idx} span={2}>
                            <div className={cellClasses}
                                 style={{opacity: isOwner && row[idx] === 1 || !isOwner && row[idx] === -1 ? 0.8 : 0.4}}
                                 onClick={() => {
                                     if (!shouldWait && row[idx] === 0 && isInProgress(status)) {
                                         onTurn(gameId, playerId, rdx, idx)
                                     }
                                 }}>
                                {row[idx] === 1 && <CloseOutlined className='owner'/>}
                                {row[idx] === -1 && <CheckCircleOutlined className='opponent'/>}
                            </div>
                        </Col>)
                    })}
                </Row>)
            )}
        </React.Fragment>);
    }

    renderError() {
        const {gameId, playerId, error, onRefresh} = this.props;

        return (<React.Fragment>
            {error && <Result
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
                extra={<Button type="primary" onClick={() => onRefresh(gameId, playerId)}>Try Again</Button>}
            />}
        </React.Fragment>)
    }

    render() {
        const {error, loading, playerName, shouldWait, status} = this.props;

        return <div className='game-board'>
            {error && this.renderError()}
            {!error && <Spin tip="Loading game data..." spinning={loading}>
                <Alert message={`Hi ${playerName}!`} type="success"/>
                {isWaiting(status) && this.renderWaitingBlock()}
                {isFinished(status) && this.renderGameOver()}
                {!isWaiting(status) && <React.Fragment>
                    <Divider/>
                    {isInProgress(status) && this.renderTurnHint()}
                    <Spin tip="Waiting..." size="large" spinning={isInProgress(status) && shouldWait }>
                        <div className='wrapper'>
                            <Row gutter={[16, 16]}>
                                <Col span={3}>
                                    <img className='hero sc' alt={'Scorpion'} src={'/sc.png'}/>
                                </Col>
                                <Col span={18}>
                                    {this.renderBoard()}
                                </Col>
                                <Col span={3} style={{marginLeft: '-30px'}}>
                                    <img className='hero sz' alt={'Sub Zero'} src={'/sz.png'}/>
                                </Col>
                            </Row>
                        </div>
                    </Spin>
                </React.Fragment>}
            </Spin>
            }
        </div>
    }
}
