import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Avatar, Badge, Button, Divider, Drawer, Form, Input, InputNumber, List, Modal, Result, Skeleton, Switch, Tag, Tooltip} from 'antd';
import {ClockCircleOutlined, MinusCircleOutlined, PlusOutlined, ReloadOutlined, SyncOutlined, UserOutlined} from '@ant-design/icons';

import {GameSession, GameStatuses} from '../app.types';
import {isWaiting} from '../app.utils';
import "./game-list.component.scss";

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
        error: PropTypes.bool.isRequired,
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
                username: null,
                threshold: 5,
                symbol: true
            }
        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.props.onInit();
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
    };

    handleCreate = () => {
        const {onCreate} = this.props;
        const {username, threshold, symbol} = this.state.form;
        onCreate(username, threshold, symbol);
        this.hideDrawer();
    }

    showDrawer = () => {
        const { username, threshold } = this.state.form;
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue({
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
                username: null,
                threshold: 5,
                symbol: true
            }
        });
    };

    renderError() {
        const {error, onReload} = this.props;

        return (<React.Fragment>
            {error && <Result
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
                extra={<Button type="primary" onClick={onReload}>Try Again</Button>}
            />}
        </React.Fragment>)
    }

    renderDrawer() {
        const {username, threshold, symbol} = this.state.form;

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
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                initialValues={{
                    'username': username,
                    'threshold': threshold
                }}
                onValuesChange={(val, all) => this.setState({form: {...all, symbol}})}
                layout="horizontal">
                <Form.Item label="Username" name="username" rules={[{
                    required: true
                }]}>
                    <Input placeholder="Enter username" prefix={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item label="Win threshold" name="threshold">
                    <InputNumber min={3} max={10} />
                </Form.Item>
                <Form.Item label="Who are you?">
                    <Switch checkedChildren="x" unCheckedChildren="o" checked={symbol} disabled
                            onChange={checked => this.setState({form: {username, symbol: checked, threshold }})}/>
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

    renderTagByStatus(status) {
        switch (status) {
            case GameStatuses.WAITING:
                return (
                    <Tag icon={<ClockCircleOutlined />} color="success">
                        waiting
                    </Tag>
                );
            case GameStatuses.ACTIVE:
                return (
                    <Tag icon={<SyncOutlined spin />} color="processing">
                        in progress
                    </Tag>
                );
            case GameStatuses.FINISHED:
                return (
                    <Tag icon={<MinusCircleOutlined />} color="default">
                        finished
                    </Tag>
                );
            default:
                return (
                    <Tag icon={<MinusCircleOutlined />} color="error">
                        undefined
                    </Tag>
                );
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
                <Button type="primary" onClick={this.showDrawer}>
                    <PlusOutlined/> New game
                </Button>
                <div className='game-list'>
                    {this.renderError()}
                    {!error && <List
                        dataSource={list}
                        header={listHeader}
                        loading={loading && !error}
                        itemLayout="horizontal"
                        renderItem={item => {
                            const actions = [];
                            if (isWaiting(item.status)) {
                                actions.push(<a key="list-connect" onClick={() => this.showModal(item.gameId)}>connect</a>);
                            }
                            const title = <React.Fragment>
                                {item.gameId}
                                <Divider type="vertical" />
                                {this.renderTagByStatus(item.status)}
                            </React.Fragment>;

                            return (
                                <List.Item actions={actions}>
                                    <Skeleton avatar title={false} loading={item.loading} active>
                                        <List.Item.Meta
                                            avatar={<Avatar src="mk.png"/>}
                                            title={title}
                                            description={getDescriptionByStatus(item.status)}
                                        />
                                        <Badge count={item.threshold} />
                                        <Divider type="vertical" />
                                        <div>owned by <strong>{item.owner}</strong></div>
                                        <Divider type="vertical" />
                                        {item.lastTurn > 0 && <div>
                                            Last turn at <strong>{new Date(item.lastTurn).toLocaleString()}</strong>
                                        </div>}
                                    </Skeleton>
                                </List.Item>
                            )
                        }}
                    />}
                    {this.renderConnectModal()}
                </div>
            </React.Fragment>
        )
    }
}
