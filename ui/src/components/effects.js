import {useEffect} from 'react';
import {message} from 'antd';

export function useMessage(connected) {
    useEffect(() => {
        if (connected !== undefined) {
            if (connected) {
                message.info('WS connection successful');
            } else {
                message.error('WS connection lost');
            }
        }
    }, [connected]);
}
