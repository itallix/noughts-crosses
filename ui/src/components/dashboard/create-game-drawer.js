import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Drawer, Form, Input, InputNumber, Switch, Tooltip} from 'antd';
import {QuestionCircleOutlined, UserOutlined} from '@ant-design/icons';

const initialState = {
    gameName: null,
    username: null,
    threshold: 5
};

const CreateGameDrawer = ({onCreate, onHide, visible}) => {

    const [symbol, setSymbol] = useState(true);
    const [form] = Form.useForm();

    const handleCreate = () => {
        form.validateFields()
            .then(values => {
                const {gameName, username, threshold} = values;
                onCreate(gameName, username, threshold, symbol);
                hideDrawer();
            })
            .catch(errorInfo => {
                console.log(errorInfo);
            });
    }

    const hideDrawer = () => {
        setSymbol(true);
        form.resetFields();
        onHide();
    };

    return (<Drawer
        title="Create a new game"
        width={720}
        onClose={hideDrawer}
        visible={visible}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}>
                <Button onClick={hideDrawer} style={{marginRight: 8}}>
                    Cancel
                </Button>
                <Button onClick={handleCreate} type="primary">
                    Submit
                </Button>
            </div>
        }>
        <Form
            form={form}
            labelCol={{
                span: 5,
            }}
            wrapperCol={{
                span: 14,
            }}
            initialValues={initialState}
            layout="horizontal">
            <Form.Item label="Game name" name="gameName" rules={[{
                required: true,
                message: 'Please enter the game name'
            }]}>
                <Input placeholder="Enter name of the game"/>
            </Form.Item>
            <Form.Item label="Username" name="username" rules={[{
                required: true,
                message: 'Please enter your name'
            }]}>
                <Input placeholder="Enter username" prefix={<UserOutlined/>}/>
            </Form.Item>
            <Form.Item
                name="threshold"
                label={<span>
                        Win threshold&nbsp;
                    <Tooltip title="How many marks placed in a horizontal, vertical, or diagonal row to win the game? Might be any value from 3 to 10.">
                            <QuestionCircleOutlined/>
                        </Tooltip>
                    </span>}>
                <InputNumber min={3} max={10}/>
            </Form.Item>
            <Form.Item
                label={<span>
                        Who are you?&nbsp;
                        <Tooltip title="Do you prefer crosses or noughts?">
                            <QuestionCircleOutlined/>
                        </Tooltip>
                    </span>}>
                <Switch checkedChildren="x" unCheckedChildren="o" checked={symbol}
                        onChange={checked => setSymbol(checked)}/>
            </Form.Item>
        </Form>
    </Drawer>);
};

CreateGameDrawer.props = {
    onCreate: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
};

export default CreateGameDrawer;
