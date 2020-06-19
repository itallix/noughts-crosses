import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Button} from 'antd';
import {Link} from 'react-router-dom';
import {WinResult} from "../../app.types";

const GameOver = ({isOwner, win}) => (<>
    {win.who === 0 &&
    <Alert
        message="Game is Over"
        description="Draw! No winner this time! Go back to the dashboard if you want to try your luck again."
        type="warning"
        showIcon
    />
    }
    {(isOwner && win.who === 1 || !isOwner && win.who === -1) &&
    <Alert
        message="Game is Over"
        description="Congratulations! You won the game! Go back to the dashboard if you want to try your luck again."
        type="success"
        showIcon
    /> ||
    (!isOwner && win.who === 1 || isOwner && win.who === -1) &&
    <Alert
        message="Game is Over"
        description="You lost the game! Go back to the dashboard if you want to try your luck again."
        type="error"
        showIcon
    />
    }
    <Link to={'/'}><Button className='dashboard-btn' type='dashed'>Dashboard</Button></Link>
</>)

GameOver.propTypes = {
    isOwner: PropTypes.bool.isRequired,
    win: WinResult
}

export default GameOver;
