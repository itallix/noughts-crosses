import React from 'react';
import {Tag} from 'antd';
import {ClockCircleOutlined, SyncOutlined, MinusCircleOutlined} from '@ant-design/icons';

import {GameStatuses} from "../../app.types";

const StatusTag = ({status}) => {
    switch (status) {
        case GameStatuses.WAITING:
            return (
                <Tag icon={<ClockCircleOutlined/>} color="success">
                    waiting
                </Tag>
            );
        case GameStatuses.ACTIVE:
            return (
                <Tag icon={<SyncOutlined spin/>} color="processing">
                    in progress
                </Tag>
            );
        case GameStatuses.FINISHED:
            return (
                <Tag icon={<MinusCircleOutlined/>} color="default">
                    finished
                </Tag>
            );
        default:
            return (
                <Tag icon={<MinusCircleOutlined/>} color="error">
                    undefined
                </Tag>
            );
    }
}

export default StatusTag;
