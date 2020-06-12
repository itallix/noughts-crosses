import React from 'react';
import {Button, Result} from 'antd';
import {Link} from 'react-router-dom';

const UNKNOWN_REASON = "Sorry, something went wrong.";

const renderResultWithError = (status, title, msg, buttons) => (<Result
    status={status}
    title={title}
    subTitle={msg || UNKNOWN_REASON}
    extra={buttons}
/>)

export const render400 = (errorMsg, buttons) => renderResultWithError("warning", "You cannot proceed with your operation", errorMsg, buttons)

export const render500 = (errorMsg, buttons) => renderResultWithError("500", "500", errorMsg, buttons);

export const render404 = (errorMsg, buttons) => renderResultWithError("404", "404", errorMsg, buttons)

const ErrorPanel = ({status, msg, onReload}) => {
    const buttons = [
        <Button key={`btn-dashboard-${new Date().getTime()}`} type="dashed"><Link to={"/"}>Dashboard</Link></Button>,
        <Button key={`btn-refresh-${new Date().getTime()}`} type="default" onClick={onReload}>Try Again</Button>
    ];

    return (<React.Fragment>
        {status === 404 && render404(msg, buttons)}
        {status === 400 && render400(msg, buttons)}
        {status === 500 && render500(msg, buttons)}
    </React.Fragment>)
}

export default ErrorPanel;
