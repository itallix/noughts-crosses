import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Col, Row} from 'antd';
import {CheckCircleOutlined, CloseOutlined} from '@ant-design/icons';

import {isFinished, isInProgress} from "../../app.utils";
import {SessionInfo} from "../../app.types";
import "./grid.component.scss";

const Cell = ({isOwner, x, value}) => (<>
    {value === 1 && (
        (isOwner && x || !isOwner && !x) && <CloseOutlined className='owner'/> ||
        (isOwner && !x || !isOwner && x) && <CheckCircleOutlined className='owner'/>)
    }
    {value === -1 && (
        (!isOwner && x || isOwner && !x) && <CloseOutlined className='opponent'/> ||
        (!isOwner && !x || isOwner && x) && <CheckCircleOutlined className='opponent'/>)
    }
</>)

Cell.propTypes = {
    isOwner: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
    x: PropTypes.bool.isRequired,
};

const isWinningCell = (seq, r, c) => seq.find(p => p.x === r && p.y === c);
const isWinner = (isOwner, value) => (isOwner && value === 1 || !isOwner && value === -1);
const isLooser = (isOwner, value) => (isOwner && value === -1 || !isOwner && value === 1);
const isClickable = (status, shouldWait, value) => isInProgress(status) && !shouldWait && value === 0;

const Grid = ({connected, gameId, onTurn, playerId, session: {board, isOwner, status, shouldWait, win, x}}) => (<>
    {board.map((row, rdx) => (
        <Row key={rdx} gutter={[3, 3]}>
            {row.map((num, idx) => {
                const cellClasses = classNames('cell', {
                    'active': isClickable(status,shouldWait, row[idx]),
                    'winner': isFinished(status) && isWinner(isOwner, win.who) && isWinningCell(win.seq, rdx, idx),
                    'looser': isFinished(status) && isLooser(isOwner, win.who) && isWinningCell(win.seq, rdx, idx),
                    'connected': connected
                })
                return (<Col key={idx} span={2}>
                    <div className={cellClasses}
                         style={{opacity: isOwner && row[idx] === 1 || !isOwner && row[idx] === -1 ? 0.8 : 0.4}}
                         onClick={() => {
                             if (isClickable(status,shouldWait, row[idx])) {
                                 onTurn(gameId, playerId, rdx, idx)
                             }
                         }}>
                        <Cell isOwner={isOwner} x={x} value={row[idx]}/>
                    </div>
                </Col>)
            })}
        </Row>)
    )}
</>)

Grid.propTypes = {
    connected: PropTypes.bool,
    gameId: PropTypes.string.isRequired,
    onTurn: PropTypes.func.isRequired,
    playerId: PropTypes.string.isRequired,
    session: SessionInfo
};

export default Grid;
