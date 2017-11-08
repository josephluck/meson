import * as Types from './types'

export function hasVNodeChanged(nodeA: Types.ValidVNode, nodeB: Types.ValidVNode): boolean {
  const typeHasChanged = typeof nodeA !== typeof nodeB
  const stringHasChanged = typeof nodeA === 'string' && nodeA !== nodeB
  const numberHasChanged = typeof nodeA === 'number' && nodeA !== nodeB
  const vNodeTypeHasChanged = isVNode(nodeA) && isVNode(nodeB) && ((nodeA as Types.VNode).type !== (nodeB as Types.VNode).type)
  return typeHasChanged || stringHasChanged || numberHasChanged || vNodeTypeHasChanged
}

export function hasComponentChanged(newComponent: Types.ValidVNode, oldComponent: Types.ValidVNode): boolean {
  return isComponent(oldComponent) && shouldComponentReplace(newComponent)
}

export function isVNode(node: Types.ValidVNode): boolean {
  return isPresent(node) && (node as Types.VNode).type && typeof node !== 'string' && typeof node !== 'number'
}

export function isPresent(node: any): boolean {
  return node !== null && node !== undefined
}

export function isComponent(vNode: Types.ValidVNode) {
  return isPresent(vNode) && (vNode as Types.Component).render !== undefined && typeof vNode === 'function'
}

export function getLargestArray<A, B>(a: A[], b: B[]) {
  return a.length > b.length ? a : b
}

export function lifecycle(
  method: Types.ValidLifecycleMethods,
  vNode: Types.ValidVNode,
  $node?: HTMLElement,
) {
  if (isComponent(vNode) && (vNode as Types.Component)[method]) {
    if (method === 'onAfterMount' || method === 'onBeforeUnmount') {
      (vNode as Types.Component)[method]($node, (vNode as Types.Component).state, (vNode as Types.Component)._update)
    } else {
      (vNode as Types.Component)[method]((vNode as Types.Component).state, (vNode as Types.Component)._update)
    }
  }
}

export function shouldComponentMount(node: Types.ValidVNode): boolean {
  return isComponent(node) && (node as Types.Component).shouldMount
    ? (node as Types.Component).shouldMount((node as Types.Component).state)
    : true
}

export function shouldComponentReplace(node: Types.ValidVNode): boolean {
  return isComponent(node) && (node as Types.Component).shouldReplace
    ? (node as Types.Component).shouldReplace((node as Types.Component).state)
    : true
}

export function shouldComponentUnmount(node: Types.ValidVNode): boolean {
  return isComponent(node) && (node as Types.Component).shouldMount
    ? !(node as Types.Component).shouldMount((node as Types.Component).state)
    : false
}
