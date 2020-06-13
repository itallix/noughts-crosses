import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, List, Tooltip} from 'antd';
import {PlusOutlined, ReloadOutlined} from '@ant-design/icons';

import {Error, GameSession} from '../../app.types';
import "./game-list.component.scss";
import ErrorPanel from "./../error-panel.component";
import notify from "../notification";
import CreateGameDrawer from "./create-game-drawer";
import ConnectGameModal from "./connect-game-modal";
import GameListItem from "./game-list-item";

const GameListComponent = ({connected, error, list, loading, onConnect, onCreate, onInit, onReload}) => {

    const [connect, setConnect] = useState(false);
    const [create, setCreate] = useState(false);
    const [gameId, setGameId] = useState(null);

    useEffect(() => {
        onInit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        notify(connected);
    }, [connected]);

    const listHeader = <div className='header'>
        List of all games
        <Tooltip color="blue" placement="topLeft" title="Refresh the list of games">
            <Button
                className='reload-btn'
                type="primary"
                icon={<ReloadOutlined/>}
                shape="round"
                loading={loading}
                onClick={onReload}/>
        </Tooltip>
    </div>;

    return (
        <>
            <ConnectGameModal gameId={gameId} visible={connect} onConnect={onConnect} onHide={() => {
                setConnect(false)
            }}/>
            <CreateGameDrawer onCreate={onCreate} visible={create} onHide={() => {
                setCreate(false)
            }}/>
            {error.status && <ErrorPanel status={error.status} msg={error.msg} onReload={onReload}/>}
            {!error.status && <>
                <Button type="primary" onClick={() => setCreate(true)}>
                    <PlusOutlined/> New game
                </Button>
                <div className='game-list'>
                    <List dataSource={list}
                          header={listHeader}
                          loading={loading && !error}
                          itemLayout="horizontal"
                          renderItem={item => (<GameListItem item={item} onConnect={(gameId) => {
                              setGameId(gameId);
                              setConnect(true);
                          }}/>)}
                    />
                </div>
            </>}
        </>
    )
}

GameListComponent.propTypes = {
    connected: PropTypes.bool,
    error: Error,
    list: PropTypes.arrayOf(GameSession),
    loading: PropTypes.bool.isRequired,
    onConnect: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired,
    onReload: PropTypes.func.isRequired
};

export default GameListComponent;
