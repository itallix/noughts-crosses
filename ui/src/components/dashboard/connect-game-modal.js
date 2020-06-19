import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Input, Modal} from 'antd';
import {UserOutlined} from '@ant-design/icons';

const ConnectGameModal = ({gameId, onConnect, onHide, visible}) => {

    const [playerName, setPlayerName] = useState("");

    const hide = () => {
        setPlayerName("");
        onHide();
    }

    const handleConnect = () => {
        if (playerName && playerName.length > 0) {
            onConnect(gameId, playerName);
            hide();
        }
    };

    return (<Modal
        title={`Join the game with id ${gameId}`}
        visible={visible}
        onOk={handleConnect}
        onCancel={hide}
        okText="Join"
        okButtonProps={{
            disabled: !playerName
        }}
        cancelText="Cancel">
        <Input placeholder="Enter the player name"
               prefix={<UserOutlined className="site-form-item-icon"/>}
               value={playerName}
               onChange={e => {
                   setPlayerName(e.target.value);
               }}/>
    </Modal>);
};

ConnectGameModal.props = {
    gameId: PropTypes.string.isRequired,
    onConnect: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
};

export default ConnectGameModal;
