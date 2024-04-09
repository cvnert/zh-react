import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProgress } from "./fiber";
import { HostRoot } from "./worlTags";

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
    workInProgress = createWorkInProgress(root.current, {});
}

// 在fiber上调度update
export function scheduleUpdateOnFiber(fiber: FiberNode) {
    // 调度功能
    const root = markUpdateFromFiberToRoot(fiber);
    renderRoot(root);

}


function markUpdateFromFiberToRoot(fiber: FiberNode) {
    let node = fiber;
    let parent = node.return;
    while (parent !== null) {
        node = parent;
        parent = node.return;
    }
    if (node.tag === HostRoot) {
        return node.stateNode;
    }
    return null;
}

function renderRoot(root: FiberRootNode) {
    //初始化
    prepareFreshStack(root);

    do {
        try {
            workLoop();
            break;
        } catch (e) {
            if (__DEV__) {
                console.warn("workLoop发生错误");
            }
            workInProgress = null;
        }

    } while (true)
}


function workLoop() {
    while (workInProgress !== null) {
        workInProgress = performUnitOfWork(workInProgress);
    }
}

function performUnitOfWork(fiber: FiberNode) {
    const next = beginWork(fiber);
    fiber.memoizedProps = fiber.pendingProps;
    if (next === null) {
        completeWork(fiber);
    } else {
        workInProgress = next;
    }

}

function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode | null = fiber;

    do {
        completeWork(node);

        const sibling = node.sibling;
        if (sibling !== null) {
            workInProgress = sibling;
            return sibling;
        }
        node = node.return;
        workInProgress = node;
    } while (node !== null)
}