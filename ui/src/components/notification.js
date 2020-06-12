import {notification} from 'antd';

const notify = (connected) => {
    if (connected !== undefined) {
        if (connected) {
            notification.success({
                message: 'WS connection successful',
                description: 'You will get updates in real time!'
            });
        } else {
            notification.warn({
                message: 'WS connection lost',
                description: 'You need to press refresh button to see updates!'
            });
        }
    }
}

export default notify;
