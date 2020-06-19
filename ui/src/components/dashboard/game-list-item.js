import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, Badge, Divider, List, Popover, Skeleton} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {isWaiting} from "../../app.utils";
import StatusTag from "./status-tag.component";
import {GameSession, GameStatuses} from "../../app.types";

const DESCRIPTIONS = {
    [GameStatuses.WAITING]: "The game is waiting for opponent. Feel free to connect.",
    [GameStatuses.ACTIVE]: "The game is already in progress. You can't connect to this game.",
    [GameStatuses.FINISHED]: "The game has been finished. You can't connect to this game."
};

const UNKNOWN_STATUS = "Game status is unknown";

const GameListItem = ({item, onConnect}) => {

    const actions = [];
    if (isWaiting(item.status)) {
        actions.push(<CopyToClipboard text={`${window.location.href}${item.gameId}`}>
            <Popover trigger="click" content={<span>Game link copied!</span>}>
                <a key="list-copy">link</a>
            </Popover>
        </CopyToClipboard>);
        actions.push(<a key="list-connect" onClick={() => onConnect(item.gameId)}>connect</a>);
    }
    const title = <>
        {item.gameName}
        <Divider type="vertical"/>
        <StatusTag status={item.status}/>
    </>;

    return (
        <List.Item actions={actions}>
            <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                    avatar={<Avatar src="mk.png"/>}
                    title={title}
                    description={DESCRIPTIONS[item.status] || UNKNOWN_STATUS}
                />
                <Badge count={item.threshold}/>
                <Divider type="vertical"/>
                <div>owned by <strong>{item.owner}</strong></div>
                <Divider type="vertical"/>
                {item.lastTurn > 0 && <div>
                    Last turn at <strong>{new Date(item.lastTurn).toLocaleString()}</strong>
                </div>}
                <Divider type="vertical"/>
                {item.winner && <span><strong>{item.winner}</strong> won</span>}
                {!item.winner && item.status === GameStatuses.FINISHED && <span>No winner</span>}
            </Skeleton>
        </List.Item>
    )
};

GameListItem.props = {
    item: GameSession,
    onConnect: PropTypes.func.isRequired
};

export default GameListItem;
