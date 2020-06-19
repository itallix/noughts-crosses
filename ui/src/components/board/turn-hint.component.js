import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Button} from 'antd';
import {Link} from 'react-router-dom';

const TurnHint = ({gameId, playerId, shouldWait, onRefresh}) =>(
    <>
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
        <Link to={'/'}><Button className='dashboard-btn' type='dashed'>Dashboard</Button></Link>
    </>
)

TurnHint.propTypes = {
    gameId: PropTypes.string.isRequired,
    onRefresh: PropTypes.func.isRequired,
    playerId: PropTypes.string.isRequired,
    shouldWait: PropTypes.bool.isRequired
};

export default TurnHint;
