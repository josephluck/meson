import * as Types from './types'

export function hasVNodeChanged(newVNode: Types.ValidVNode, oldVNode: Types.ValidVNode): boolean {
  const typeHasChanged = typeof newVNode !== typeof oldVNode
  const stringHasChanged = typeof newVNode === 'string' && newVNode !== oldVNode
  const numberHasChanged = typeof newVNode === 'number' && newVNode !== oldVNode
  const vNodeTypeHasChanged = isVNode(newVNode) && isVNode(oldVNode) && ((newVNode as Types.VNode).type !== (oldVNode as Types.VNode).type)
  const hasVNodeTurnedToComponent = (isVNode(newVNode) && isComponent(oldVNode)) || (isVNode(oldVNode) && isComponent(newVNode))
  return typeHasChanged || stringHasChanged || numberHasChanged || vNodeTypeHasChanged || hasVNodeTurnedToComponent
}

export function hasComponentChanged(newComponent: Types.ValidVNode, oldComponent: Types.ValidVNode): boolean {
  return isComponent(newComponent) && isComponent(oldComponent) && shouldComponentReplace(newComponent)
}

export function isVNode(node: Types.ValidVNode): boolean {
  return isPresent(node) && (node as Types.VNode).type && typeof node !== 'string' && typeof node !== 'number'
}

export function isPresent(node: any): boolean {
  return node !== null && node !== undefined
}

export function isComponent(vNode: Types.ValidVNode) {
  return isPresent(vNode) && (vNode as Types.Component).render !== undefined
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
