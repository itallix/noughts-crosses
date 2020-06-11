import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Input, Result} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';

import {Error, GameStatuses} from '../app.types';
import "./game-board.component.scss";
import {render400, render404} from "../app.utils";

export default class GameConnectComponent extends Component {

    static propTypes = {
        error: Error,
        gameId: PropTypes.string.isRequired,
        playerName: PropTypes.string,
        gameName: PropTypes.string,
        status: PropTypes.oneOf(Object.values(GameStatuses)),
        onConnect: PropTypes.func.isRequired,
        onInit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            valid: false
        }
    }

    componentDidMount() {
        const {gameId, onInit} = this.props;
        onInit(gameId);
    }

    handleConnect = () => {
        const {gameId, onConnect} = this.props;
        const {username} = this.state;
        onConnect(gameId, username);
    }

    renderInvite() {
        const {gameName, playerName} = this.props;
        const {valid} = this.state;

        return (<Result
            title={`You have been invited to join the game [${gameName}]!`}
            subTitle={`Please enter your name to start playing this game with ${playerName}`}
            extra={
                <Input
                    style={{width: '45%'}}
                    placeholder="Enter your username"
                    onChange={e => {
                        const username = e.target.value;
                        this.setState({username, valid: username.length > 0 && username !== playerName})
                    }}
                    onPressEnter={() => {
                        if (valid) {
                            this.handleConnect();
                        }
                    }}
                    prefix={<UserOutlined className="site-form-item-icon"/>}
                    suffix={
                        <Button type="primary" key="console" disabled={!valid} onClick={this.handleConnect}>
                            Join
                        </Button>
                    }
                />
            }
        />)
    }

    renderCannotJoin() {
        const {status} = this.props;

        let title;
        switch (status) {
            case GameStatuses.FINISHED:
                title = "You cannot join this game because it has been already finished";
                break;
            case GameStatuses.ACTIVE:
                title = "You cannot join the game that's being in progress";
                break;
            default:
                title = "You cannot join the game with unknown status";
        }

        return (<Result
            title={title}
            extra={
                <Button type="dashed"><Link to={"/"}>Dashboard</Link></Button>
            }
        />)
    }

    renderError() {
        const {error} = this.props;


        const dashboard = <Button key={`btn-dashboard-${new Date().getTime()}`} type="dashed"><Link to={"/"}>Dashboard</Link></Button>;

        return (<React.Fragment>
            {error.status === 404 && render404(error.msg, [dashboard])}
            {error.status === 400 && render400(error.msg, [dashboard])}
        </React.Fragment>)
    }

    render() {
        const {error, status} = this.props;

        return <>
            {error.status && this.renderError()}
            {!error.status && status === GameStatuses.WAITING && this.renderInvite()}
            {!error.status && status !== GameStatuses.WAITING && this.renderCannotJoin()}
        </>
    }
}
