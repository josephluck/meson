import * as attributes from './attributes'
import * as Types from './types'
import * as utils from './utils'
export { View, Update, Component } from './types'

export function h(type: keyof HTMLElementTagNameMap, props?: any, children?: Types.ValidVNode | Types.ValidVNode[]): Types.VNode {
  return { type, props, children }
}

function createComponent(
  $parent: HTMLElement,
  component: Types.Component,
  index: number = 0,
): HTMLElement | Text {
  let state = component.state
  const update = (updater: Types.Updater<any>) => {
    state = typeof updater === 'function'
      ? updater(state)
      : updater
    component.state = state
    render()
  }
  function render() {
    const $oldNode = $parent.childNodes[index]
    const $newNode = createElement(component.render(state, update))
    if ($oldNode && utils.shouldComponentReplace(component)) {
      console.log('Replacing component', component)
      utils.lifecycle('onBeforeReplace', component)
      $parent.replaceChild($newNode, $oldNode)
      utils.lifecycle('onAfterReplace', component)
    } else if (!$oldNode && utils.shouldComponentMount(component)) {
      console.log('Appending component', component)
      utils.lifecycle('onBeforeMount', component)
      // This isn't enough, if there's conditional elements before the element in question
      $parent.appendChild($newNode)
      utils.lifecycle('onAfterMount', component)
    }
  }
  component._update = update
  return utils.shouldComponentMount(component)
    ? createElement(component.render(state, update))
    : null
}

function createElement(
  validVNode: Types.ValidVNode,
  $parent?: HTMLElement,
  index?: number,
  create: boolean = false
): HTMLElement | Text {
  if (typeof validVNode === 'string' || typeof validVNode === 'number') {
    return document.createTextNode(validVNode.toString())
  } else if (utils.isVNode(validVNode)) {
    const vNode = validVNode as Types.VNode
    const $parent = document.createElement(vNode.type)
    const children = (vNode.children instanceof Array ? vNode.children : [vNode.children])
    attributes.addAttributes($parent, vNode.props)
    attributes.addEventListeners($parent, vNode.props)

    // Call component lifecycle methods for all component children
    if (create) {
      children
        .filter(c => utils.isPresent(c) && utils.shouldComponentMount(c))
        .forEach(c => utils.lifecycle('onBeforeMount', c))
    }

    children
      .map((child, i) => utils.isComponent(child)
        ? createComponent($parent, child as Types.Component, i)
        : createElement(child)
      )
      .filter(utils.isPresent)
      .forEach(child => {
        // This isn't enough, if there's conditional elements before the element in question
        console.log('Appending child', child)
        $parent.appendChild(child)
      })

    // Call component lifecycle methods for all component children
    if (create) {
      children
        .filter(utils.shouldComponentMount)
        .forEach((child, i) => utils.lifecycle('onAfterMount', child, $parent.childNodes[i] as HTMLElement))
    }

    return $parent
  } else if (utils.isComponent(validVNode) && $parent) {
    const component = createComponent($parent, validVNode as Types.Component, index)
    return component
  }
}

function updateElement(
  $parent: HTMLElement,
  newVNode: Types.ValidVNode,
  oldVNode?: Types.ValidVNode,
  index: number = 0,
) {
  const shouldRemoveVNode = utils.isPresent(oldVNode) && utils.isVNode(oldVNode) && !utils.isPresent(newVNode)
  const shouldRemoveComponent = utils.isPresent(oldVNode) && utils.isComponent(oldVNode) && !utils.isPresent(newVNode)
  const shouldAppendVNode = !utils.isPresent(oldVNode) && utils.isVNode(newVNode)
  const shouldAppendComponent = !utils.isPresent(oldVNode) && utils.isComponent(newVNode) && utils.shouldComponentMount(newVNode)
  const shouldReplaceVNode = utils.hasVNodeChanged(newVNode, oldVNode)
  const shouldReplaceComponent = utils.hasComponentChanged(newVNode, oldVNode)
  const sameVNode = utils.isVNode(newVNode) && utils.isVNode(oldVNode)

  // Index is not always going to be correct since some elements / components are conditional
  if (shouldRemoveVNode) {
    console.log('Removing Vnode')
    utils.lifecycle('onBeforeUnmount', oldVNode, $parent.childNodes[index] as HTMLElement)
    // Removing might not work as it cocks up the index
    $parent.removeChild($parent.childNodes[index])
    utils.lifecycle('onAfterUnmount', oldVNode)
  }

  else if (shouldRemoveComponent) {
    // Removing might not work as it cocks up the index
    console.log('Removing component', oldVNode)
    $parent.removeChild($parent.childNodes[index])
  }

  else if (shouldAppendVNode) {
    // This isn't enough, if there's conditional elements before the element in question
    console.log('Appending vNode', newVNode)
    $parent.appendChild(createElement(newVNode, $parent as HTMLElement, index, true))
  }

  else if (shouldAppendComponent) {
    // This isn't enough, if there's conditional elements before the element in question
    const toAppend = createElement(newVNode, $parent as HTMLElement, index, true)
    if (utils.isPresent(toAppend)) {
      console.log('Appending component', newVNode)
      utils.lifecycle('onBeforeMount', newVNode)
      $parent.appendChild(toAppend)
      utils.lifecycle('onAfterMount', newVNode, toAppend as HTMLElement)
    } else {
      console.log('Skipping component', newVNode)
    }
  }

  else if (shouldReplaceVNode) {
    console.log('Replacing vNode', newVNode)
    $parent.replaceChild(createElement(newVNode), $parent.childNodes[index])
  }

  else if (shouldReplaceComponent) {
    (newVNode as Types.Component).state = (oldVNode as Types.Component).state
    const toReplace = createElement(newVNode, $parent as HTMLElement, index)
    if (toReplace) {
      console.log('Replacing component', newVNode)
      utils.lifecycle('onBeforeReplace', newVNode)
      $parent.replaceChild(toReplace, $parent.childNodes[index])
      utils.lifecycle('onAfterReplace', newVNode)
    } else {
      console.log('Skipping component', newVNode)
    }
  }

  else if (sameVNode) {
    const $child = $parent.childNodes[index] as HTMLElement
    const nVNode = newVNode as Types.VNode
    const oVNode = oldVNode as Types.VNode
    console.log('Moving on to children, nothing changed', nVNode)
    const nVNodeChildren = nVNode.children instanceof Array
      ? nVNode.children
      : [nVNode.children]
    const oVNodeChildren = oVNode.children instanceof Array
      ? oVNode.children
      : [oVNode.children]
    attributes.updateAttributes($child, nVNode.props, oVNode.props)
    attributes.updateEventListeners($child, nVNode.props, oVNode.props)
    utils.getLargestArray(nVNodeChildren, oVNodeChildren)
      .forEach((c, i) => {
        updateElement($child, nVNodeChildren[i], oVNodeChildren[i], i)
      })
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
