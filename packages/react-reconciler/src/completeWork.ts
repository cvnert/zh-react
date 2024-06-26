//递归中的归阶段

import { appendInitialChild, createInstance, createTestInstance } from "hostConfig";
import { FiberNode } from "./fiber";
import { HostComponent, HostRoot, HostText } from "./worlTags";
import { NoFlags } from "./fiberFlages";

export const completeWork = (wip: FiberNode) => {
  // 子fiberNode 比较返回子fiberNode
  const newProps = wip.pendingProps;
  const current = wip.alternate;
  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        //构建dom
        const instance = createInstance(wip.type, newProps)
        //将dom插入到dom树中
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null;
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        //构建dom
        const instance = createTestInstance(newProps.content)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null;
    case HostRoot:
      bubbleProperties(wip)
      return null;
    default:
      if (__DEV__) {
        console.error('未处理的边界情况')
      }
      break;
  }
};


function appendAllChildren(parent: FiberNode, wip: FiberNode) {
  let node = wip.child

  while (node !== null) {
    if (node?.tag === HostComponent || node?.tag === HostText) {
      appendInitialChild(parent, node?.stateNode)
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node == wip) {
      return
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
      node = node?.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }


}


function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags;

  let child = wip.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags

    child.return = wip
    child = child.sibling
  }

  wip.subtreeFlags |= subtreeFlags
}