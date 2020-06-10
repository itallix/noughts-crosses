import React from 'react';
import {GameStatuses} from "./app.types";
import { Result } from "antd";

export const isWaiting = status => status === GameStatuses.WAITING;

export const isFinished = status => status === GameStatuses.FINISHED;

export const isInProgress = status => status === GameStatuses.ACTIVE;

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
