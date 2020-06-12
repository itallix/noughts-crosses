import {GameStatuses} from "./app.types";

export const isWaiting = status => status === GameStatuses.WAITING;

export const isFinished = status => status === GameStatuses.FINISHED;

export const isInProgress = status => status === GameStatuses.ACTIVE;
