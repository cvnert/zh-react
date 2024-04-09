import { Action } from "shared/ReactTypes";
import { Update } from "./fiberFlages";

export interface Update<State> {
    action: Action<State>;
}

export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null;
    }
}

// 创建update实例
export const createUpdate = <State>(action: Action<State>): Update<State> => {
    return {
        action
    }
}

// 初始化update实例的方法
export const createUpdateQueue = <State>() => {
    return {
        shared: {
            pending: null
        }
    } as UpdateQueue<State>
}


// 将Update加入UpdateQueue

export const enqueueUpdate = <State>(UpdateQueue: UpdateQueue<State>, update: Update<State>) => {
    UpdateQueue.shared.pending = update;
}


// UpdateQueue消费Update
export const processUpdateQueue = <State>(baseState: State, pendingUpdate: Update<State> | null): { memoizedState: State } => {
    const result: ReturnType<typeof processUpdateQueue<State>> = { memoizedState: baseState }
    if (pendingUpdate !== null) {
        const action = pendingUpdate.action;
        if (action instanceof Function) {
            result.memoizedState = action(baseState);
        } else {
            result.memoizedState = action;
        }
    }
    return result;
}