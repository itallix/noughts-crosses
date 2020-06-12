import React from 'react';
import PropTypes from 'prop-types';
import {Button, Input, Result} from 'antd';
import {UserOutlined} from '@ant-design/icons';

const Invite = ({game, player, valid, onUsernameChange, onConnect, threshold}) => {

    return (<Result
        title={`You have been invited to join the game [${game}] with threshold ${threshold}!`}
        subTitle={`Please enter your name to start playing this game with ${player}`}
        extra={
            <Input
                style={{width: '45%'}}
                placeholder="Enter your username"
                onChange={e => onUsernameChange(e.target.value)}
                onPressEnter={() => {
                    if (valid) {
                        onConnect();
                    }
                }}
                prefix={<UserOutlined className="site-form-item-icon"/>}
                suffix={
                    <Button type="primary" key="console" disabled={!valid} onClick={onConnect}>
                        Join
                    </Button>
                }
            />
        }
    />)
}

Invite.propTypes = {
    game: PropTypes.string.isRequired,
    player: PropTypes.string.isRequired,
    valid: PropTypes.bool.isRequired,
    onUsernameChange: PropTypes.func.isRequired,
    onConnect: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired
}

export default Invite;
