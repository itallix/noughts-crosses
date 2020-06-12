import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Avatar, Badge, Button, Divider, Drawer, Form, Input, InputNumber, List, Modal, Popover, Skeleton, Switch, Tooltip} from 'antd';
import {PlusOutlined, QuestionCircleOutlined, ReloadOutlined, UserOutlined} from '@ant-design/icons';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {Error, GameSession, GameStatuses} from '../../app.types';
import {isWaiting} from '../../app.utils';
import "./game-list.component.scss";
import ErrorPanel from "./../error-panel.component";
import StatusTag from "./status-tag.component";
import notify from "../notification";

const getDescriptionByStatus = status => {
    switch (status) {
        case GameStatuses.WAITING:
            return "The game is waiting for opponent. Feel free to connect.";
        case GameStatuses.ACTIVE:
            return "The game is already in progress. You can't connect to this game.";
        case GameStatuses.FINISHED:
            return "The game has been finished. You can't connect to this game.";
        default:
            return "Game status is unknown"
    }
}

export default class GameListComponent extends Component {

    static propTypes = {
        connected: PropTypes.bool,
        error: Error,
        list: PropTypes.arrayOf(GameSession),
        loading: PropTypes.bool.isRequired,
        onConnect: PropTypes.func.isRequired,
        onCreate: PropTypes.func.isRequired,
        onInit: PropTypes.func.isRequired,
        onReload: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            connect: false,
            create: false,
            gameId: null,
            playerName: null,
            form: {
                gameName: null,
                username: null,
                threshold: 5,
                symbol: true
            }
        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        const {onInit} = this.props;
        onInit();
    }

    showModal = (gameId) => {
        this.setState({
            connect: true,
            gameId: gameId,
            playerName: null,
        });
    };

    hideModal = () => {
        this.setState({
            connect: false,
            gameId: null,
            playerName: null,
        });
    };

    handleConnect = () => {
        const {gameId, playerName} = this.state;
        this.props.onConnect(gameId, playerName);
        this.hideModal();
    };

    handleCreate = () => {
        const {onCreate} = this.props;
        const {gameName, username, threshold, symbol} = this.state.form;
        onCreate(gameName, username, threshold, symbol);
        this.hideDrawer();
    }

    showDrawer = () => {
        const {gameName, username, threshold} = this.state.form;
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue({
                gameName: gameName,
                username: username,
                threshold: threshold
            });
        }
        this.setState({
            create: true
        });
    };

    hideDrawer = () => {
        this.formRef.current.resetFields();
        this.setState({
            create: false,
            form: {
                gameName: null,
                username: null,
                threshold: 5,
                symbol: true
            }
        });
    };

    renderDrawer() {
        const {gameName, username, threshold, symbol} = this.state.form;

        return (<Drawer
            title="Create a new game"
            width={720}
            onClose={this.hideDrawer}
            visible={this.state.create}
            bodyStyle={{paddingBottom: 80}}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}>
                    <Button onClick={this.hideDrawer} style={{marginRight: 8}}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleCreate} type="primary">
                        Submit
                    </Button>
                </div>
            }>
            <Form
                ref={this.formRef}
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 14,
                }}
                initialValues={{
                    'gameName': gameName,
                    'username': username,
                    'threshold': threshold
                }}
                onValuesChange={(val, all) => this.setState({form: {...all, symbol}})}
                layout="horizontal">
                <Form.Item label="Game name" name="gameName" rules={[{
                    required: true
                }]}>
                    <Input placeholder="Enter name of the game"/>
                </Form.Item>
                <Form.Item label="Username" name="username" rules={[{
                    required: true
                }]}>
                    <Input placeholder="Enter username" prefix={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item
                    name="threshold"
                    label={<span>
                        Win threshold&nbsp;
                        <Tooltip title="How many marks placed in a horizontal, vertical, or diagonal row to win the game? Might be any value from 3 to 10.">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    </span>}>
                    <InputNumber min={3} max={10}/>
                </Form.Item>
                <Form.Item
                    label={<span>
                        Who are you?&nbsp;
                        <Tooltip title="Do you prefer crosses or noughts?">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    </span>}>
                    <Switch checkedChildren="x" unCheckedChildren="o" checked={symbol}
                            onChange={checked => this.setState({form: {gameName, username, symbol: checked, threshold}})}/>
                </Form.Item>
            </Form>
        </Drawer>)
    }

    renderConnectModal() {
        const {gameId, connect, playerName} = this.state;

        return (
            <Modal
                title={`Join the game with id ${gameId}`}
                visible={connect}
                onOk={this.handleConnect}
                onCancel={this.hideModal}
                okText="Join"
                okButtonProps={{
                    disabled: !playerName
                }}
                cancelText="Cancel">
                <Input placeholder="Enter the player name"
                       prefix={<UserOutlined className="site-form-item-icon"/>}
                       value={playerName}
                       onChange={e => {
                           this.setState({
                               playerName: e.target.value
                           });
                       }}/>
            </Modal>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {connected} = this.props;
        if (connected !== prevProps.connected) {
            notify(connected);
        }
    }

    render() {
        const {error, list, loading, onReload} = this.props;

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
            <React.Fragment>
                {this.renderDrawer()}
                {error.status && <ErrorPanel status={error.status} msg={error.msg} onReload={onReload} />}
                {!error.status && <React.Fragment>
                    <Button type="primary" onClick={this.showDrawer}>
                        <PlusOutlined/> New game
                    </Button>
                    <div className='game-list'>
                        <List dataSource={list}
                              header={listHeader}
                              loading={loading && !error}
                              itemLayout="horizontal"
                              renderItem={item => {
                                  const actions = [];
                                  if (isWaiting(item.status)) {
                                      actions.push(<CopyToClipboard text={`${window.location.href}${item.gameId}`}>
                                          <Popover trigger="click" content={<span>Game link copied!</span>}>
                                              <a key="list-copy">link</a>
                                          </Popover>
                                      </CopyToClipboard>);
                                      actions.push(<a key="list-connect" onClick={() => this.showModal(item.gameId)}>connect</a>);
                                  }
                                  const title = <React.Fragment>
                                      {item.gameName}
                                      <Divider type="vertical"/>
                                      <StatusTag status={item.status} />
                                  </React.Fragment>;

                                  return (
                                      <List.Item actions={actions}>
                                          <Skeleton avatar title={false} loading={item.loading} active>
                                              <List.Item.Meta
                                                  avatar={<Avatar src="mk.png"/>}
                                                  title={title}
                                                  description={getDescriptionByStatus(item.status)}
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
                              }}
                        />
                        {this.renderConnectModal()}
                    </div>
                </React.Fragment>}
            </React.Fragment>
        )
    }
}
