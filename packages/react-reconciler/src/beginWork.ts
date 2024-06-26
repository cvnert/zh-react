//递归中的递阶段

import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { UpdateQueue, processUpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText } from "./worlTags";
import { mountChildFibers, reconcileChildFibers } from "./childFibers";

export const beginWork = (wip: FiberNode) => {
  // 子fiberNode 比较返回子fiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    default:
      if (__DEV__) {
        console.warn("未知的tag");
      }
      break;
  }
  return null
};

function updateHostRoot(wip: FiberNode) {
  //更新HostRoot
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<ReactElementType | null>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);

  return wip.child;
}

function updateHostComponent(wip: FiberNode) {
  //更新HostComponent
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);

  return wip.child;
}


function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate;

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current.child, children);
  } else {
    wip.child = mountChildFibers(wip, null, children);
  }
}
