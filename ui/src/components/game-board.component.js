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
        gameId: PropTypes.string.isRequired,
        shouldWait: PropTypes.bool.isRequired,
        isOwner: PropTypes.bool.isRequired,
        onRefresh: PropTypes.func.isRequired,
        onTurn: PropTypes.func.isRequired,
        board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired),
        playerName: PropTypes.string.isRequired,
        status: PropTypes.oneOf(Object.values(GameStatuses)).isRequired,
        win: WinResult
    };

    handleTurn = (row, col) => {
        this.props.onTurn(row, col)
    };

    renderGameOver() {
        const {isOwner, win} = this.props;
        console.log(win);
        return (<React.Fragment>
            <br/>
            {(isOwner && win.who === 1 || !isOwner && win.who === - 1) &&
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

    render() {
        const {board, gameId, isOwner, onRefresh, playerName, shouldWait, status, win} = this.props;

        return <div className='game-board'>
            <Alert message={`Hi ${playerName}!`} type="success" />
            {isWaiting(status) && <Result
                status="success"
                title={`Hi ${playerName}! You've just successfully created the new game`}
                subTitle={`Game id: ${gameId}. Please wait for opponent to join the game.`}
                extra={[
                    <Button type="primary" key="refresh" onClick={onRefresh}>
                        Refresh
                    </Button>
                ]}
            />}
            {isFinished(status) && this.renderGameOver()}
            {!isWaiting(status) && <React.Fragment>
                <Divider />
                {isInProgress(status) && <React.Fragment>
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
                </React.Fragment>}
                {!isFinished(status) && <Button className='refresh-btn' type='dashed' onClick={onRefresh}>Refresh</Button>}
                <Spin tip="Waiting..." size="large" spinning={isInProgress(status) && shouldWait}>
                    <div className='wrapper'>
                        <Row gutter={[16, 16]}>
                            <Col span={3}>
                                <img className='hero sc' src={'sc.png'} />
                            </Col>
                            <Col span={18}>
                                {board.map((row, rdx) => (
                                        <Row key={rdx} gutter={[3, 3]}>
                                            {row.map((num, idx) => {
                                                const cellClasses = classNames('cell', {
                                                    'active': !shouldWait && row[idx] === 0 && isInProgress(status),
                                                    'winner': win && (isOwner && win.who === 1 || !isOwner && win.who === - 1) &&
                                                        isFinished(status) && win.seq.find(c => c.x === rdx && c.y === idx),
                                                    'looser': win && (isOwner && win.who === -1 || !isOwner && win.who === 1) &&
                                                        isFinished(status) && win.seq.find(c => c.x === rdx && c.y === idx)
                                                })
                                                return (<Col key={idx} span={2}>
                                                    <div className={cellClasses}
                                                         style={{opacity: isOwner && row[idx] === 1 || !isOwner && row[idx] === -1 ? 0.8 : 0.4}}
                                                         onClick={() => {
                                                             if (!shouldWait && row[idx] === 0 && isInProgress(status)) {
                                                                 this.handleTurn(rdx, idx)
                                                             }
                                                         }}>
                                                        {row[idx] === 1 && <CloseOutlined className='owner'/>}
                                                        {row[idx] === -1 && <CheckCircleOutlined className='opponent'/>}
                                                    </div>
                                                </Col>)
                                            })}
                                        </Row>)
                                )}
                            </Col>
                            <Col span={3} style={{marginLeft: '-30px'}}>
                                <img className='hero sz' src={'sz.png'} />
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </React.Fragment>}
        </div>
    }
}
