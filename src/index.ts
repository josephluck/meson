import * as attributes from './attributes'
import * as Types from './types'
import * as utils from './utils'
export { View, Update } from './types'

export function h(type: keyof HTMLElementTagNameMap, props?: any, children?: Types.ValidVNode | Types.ValidVNode[]): Types.VNode {
  return { type, props, children }
}

const isComponent = (vNode: Types.ValidVNode) => {
  return typeof vNode === 'function'
}

function createComponent(
  $parent: HTMLElement,
  component: Types.Component<any>,
  index: number = 0,
) {
  let state // This will need to persist when component is re-instantiated...
  const update = (updater: Types.Updater<any>) => {
    state = typeof updater === 'function'
      ? updater(state)
      : updater
    render()
  }
  function render() {
    const oldChild = $parent.childNodes[index]
    const newChild = createElement(component(state, update))
    if (oldChild) {
      $parent.replaceChild(newChild, oldChild)
    } else {
      $parent.appendChild(newChild)
    }
  }
  return createElement(component(state, update))
}

function createElement(node: Types.ValidVNode): HTMLElement | Text {
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(node.toString())
  } else if (utils.isVNode(node)) {
    const vNode = node as Types.VNode
    const $el = document.createElement(vNode.type)
    const children = vNode.children instanceof Array ? vNode.children : [vNode.children]
    attributes.addAttributes($el, vNode.props)
    attributes.addEventListeners($el, vNode.props)
    children.filter(utils.isPresent).map((child, index) => {
      if (isComponent(child)) {
        return createComponent($el, child as Types.Component<any>, index)
      } else {
        return createElement(child)
      }
    })
      .forEach($el.appendChild.bind($el))
    return $el
  }
}

function updateElement(
  $parent: HTMLElement | Node,
  newVNode: Types.ValidVNode,
  oldVNode?: Types.ValidVNode,
  index: number = 0,
) {
  const child = $parent.childNodes[index]
  if (!utils.isPresent(oldVNode) && utils.isPresent(newVNode)) {
    $parent.appendChild(createElement(newVNode))
  } else if (!utils.isPresent(newVNode) && utils.isPresent(child)) {
    $parent.removeChild(child)
  } else if (utils.hasVNodeChanged(newVNode, oldVNode)) {
    $parent.replaceChild(createElement(newVNode), child)
  } else if (utils.isVNode(newVNode) && utils.isVNode(oldVNode)) {
    const nVNode = newVNode as Types.VNode
    const oVNode = oldVNode as Types.VNode
    const nVNodeChildren = nVNode.children instanceof Array ? nVNode.children : [nVNode.children]
    const oVNodeChildren = oVNode.children instanceof Array ? oVNode.children : [oVNode.children]
    const hChild = child as HTMLElement
    attributes.updateAttributes(hChild, nVNode.props, oVNode.props)
    attributes.updateEventListeners(hChild, nVNode.props, oVNode.props)
    utils.getLargestArray(nVNodeChildren, oVNodeChildren)
      .forEach((_, i) => updateElement(child, nVNodeChildren[i], oVNodeChildren[i], i))
  }
}

export function app<S>(state: S) {
  let oldVNode
  let app
  let node
  const render = () => {
    const newVNode = app(state, update)
    updateElement(node, newVNode, oldVNode)
    oldVNode = newVNode
  }
  function run(elm: string | HTMLElement, view: Types.View<S>) {
    app = view
    node = typeof elm === 'string' ? document.querySelector(elm) : elm
    render()
  }
  function update(updater: Types.Updater<S>) {
    state = typeof updater === 'function'
      ? updater(state)
      : updater
    render()
  }
  return { update, run }
}

export function run<S>(elm: string | HTMLElement, view: Types.View<S>) {
  const node = typeof elm === 'string' ? document.querySelector(elm) : elm
  let state
  let oldVNode
  const update = (newState: S) => {
    state = newState
    render()
  }
  const render = () => {
    const newVNode = view(state, update)
    updateElement(node, newVNode, oldVNode)
    oldVNode = newVNode
  }
  render()
  return update
}

export default app
