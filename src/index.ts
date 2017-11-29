import * as attributes from './attributes'
import * as Types from './types'
import * as utils from './utils'
export { View, Update, Component } from './types'

export function h(
  type: keyof HTMLElementTagNameMap,
  props?: any,
  children?: Types.ValidVNode | Types.ValidVNode[],
): Types.VNode {
  return { type, props, children }
}

function createComponent(
  component: Types.Component,
  $dom: HTMLElement | undefined,
): HTMLElement | Text {
  let state = component.state
  const update = (updater: Types.Updater<any>) => {
    state = typeof updater === 'function' ? updater(state) : updater
    component.state = state
    render()
  }
  function render() {
    // This isn't enough, the index may be wrong.
    // Would be much better to have direct access to the existing component
    // in this function. Would be passed in from outside
    const $newNode = createElement(component.render(state, update))
    if ($dom && utils.shouldComponentReplace(component)) {
      console.log('Replacing component', component)
      utils.lifecycle('onBeforeReplace', component)
      $dom.parentElement.replaceChild($newNode, $dom)
      utils.lifecycle('onAfterReplace', component)
    }
  }
  component._update = update
  return utils.shouldComponentMount(component)
    ? createElement(component.render(state, update))
    : document.createTextNode('component-placeholder')
}

function createElement(
  validVNode: Types.ValidVNode,
  $parent?: HTMLElement,
  index?: number,
  create: boolean = false,
): HTMLElement | Text {
  if (typeof validVNode === 'string' || typeof validVNode === 'number') {
    return document.createTextNode(validVNode.toString())
  } else if (utils.isVNode(validVNode)) {
    const vNode = validVNode as Types.VNode
    const $parent = document.createElement(vNode.type)
    const children =
      vNode.children instanceof Array ? vNode.children : [vNode.children]
    attributes.addAttributes($parent, vNode.props)
    attributes.addEventListeners($parent, vNode.props)

    // Call component lifecycle methods for all component children
    if (create) {
      children
        .filter(utils.isComponent)
        .forEach(component => utils.lifecycle('onBeforeMount', component))
    }

    children
      .map((child, i) => {
        if (utils.isComponent(child)) {
          const $dom = $parent.childNodes[i] as HTMLElement
          return createComponent(child as Types.Component, $dom)
        } else {
          return createElement(child)
        }
      })
      .filter(utils.isPresent)
      .forEach(child => {
        // This isn't enough, if there are any skipped elements before the element in question
        console.log('Appending child', child)
        $parent.appendChild(child)
      })

    // Call component lifecycle methods for all component children
    if (create) {
      children.forEach((child, i) => {
        if (utils.shouldComponentMount(child)) {
          utils.lifecycle('onAfterMount', child, $parent.childNodes[
            i
          ] as HTMLElement)
        }
      })
    }

    return $parent
  } else if (utils.isComponent(validVNode)) {
    const $dom = $parent
      ? ($parent.childNodes[index] as HTMLElement)
      : undefined
    return createComponent(validVNode as Types.Component, $dom)
  }
}

function updateElement(
  $parent: HTMLElement,
  newVNode: Types.ValidVNode,
  oldVNode?: Types.ValidVNode,
  index: number = 0,
) {
  // Need a better way of working out the child
  // One idea is to have an attribute on an oldVNode which is
  // the DOM element. Essentially, to make the oldVNode stateful
  // so that replaceChild can look at oldVNode.dom

  // For append child
  const $child = $parent.childNodes[index] as HTMLElement
  const shouldRemoveVNode =
    utils.isPresent(oldVNode) &&
    utils.isVNode(oldVNode) &&
    !utils.isPresent(newVNode)
  const shouldRemoveComponent =
    utils.isPresent(oldVNode) &&
    utils.isComponent(oldVNode) &&
    !utils.isPresent(newVNode)
  const shouldAppendVNode =
    !utils.isPresent(oldVNode) && utils.isVNode(newVNode)
  const shouldAppendComponent =
    !utils.isPresent(oldVNode) &&
    utils.isComponent(newVNode) &&
    utils.shouldComponentMount(newVNode)
  const shouldReplaceVNode = utils.hasVNodeChanged(newVNode, oldVNode)
  const shouldReplaceComponent = utils.hasComponentChanged(newVNode, oldVNode)
  const sameVNode = utils.isVNode(newVNode) && utils.isVNode(oldVNode)

  // Index is not always going to be correct since some elements / components are conditional
  if (shouldRemoveVNode) {
    console.log('Removing Vnode')
    utils.lifecycle('onBeforeUnmount', oldVNode, $child)
    // This won't work, we can't rely on the index
    $parent.removeChild($child)
    utils.lifecycle('onAfterUnmount', oldVNode)
  } else if (shouldRemoveComponent) {
    // This won't work, we can't rely on the index
    console.log('Removing component', oldVNode)
    $parent.removeChild($child)
  } else if (shouldAppendVNode) {
    // This isn't enough, if there are any skipped elements before the element in question
    console.log('Appending vNode', newVNode)
    $parent.appendChild(
      createElement(newVNode, $parent as HTMLElement, index, true),
    )
  } else if (shouldAppendComponent) {
    // This isn't enough, if there are any skipped elements before the element in question
    const toAppend = createElement(
      newVNode,
      $parent as HTMLElement,
      index,
      true,
    )
    if (utils.isPresent(toAppend)) {
      console.log('Appending component', newVNode)
      utils.lifecycle('onBeforeMount', newVNode)
      $parent.appendChild(toAppend)
      utils.lifecycle('onAfterMount', newVNode, toAppend as HTMLElement)
    } else {
      console.log('Skipping component', newVNode)
    }
  } else if (shouldReplaceVNode) {
    console.log('Replacing vNode', newVNode)
    const toReplace = createElement(newVNode)
    $parent.replaceChild(toReplace, $child)
  } else if (shouldReplaceComponent) {
    ;(newVNode as Types.Component).state = (oldVNode as Types.Component).state
    const toReplace = createElement(newVNode, $parent as HTMLElement, index)
    if (toReplace) {
      console.log('Replacing component', newVNode)
      utils.lifecycle('onBeforeReplace', newVNode)
      $parent.replaceChild(toReplace, $child)
      utils.lifecycle('onAfterReplace', newVNode)
    } else {
      console.log('Skipping component', newVNode)
    }
  } else if (sameVNode && $child) {
    const nVNode = newVNode as Types.VNode
    const oVNode = oldVNode as Types.VNode
    console.log('Moving on to children, nothing changed', nVNode)
    const nVNodeChildren =
      nVNode.children instanceof Array ? nVNode.children : [nVNode.children]
    const oVNodeChildren =
      oVNode.children instanceof Array ? oVNode.children : [oVNode.children]
    attributes.updateAttributes($child, nVNode.props, oVNode.props)
    attributes.updateEventListeners($child, nVNode.props, oVNode.props)
    utils.getLargestArray(nVNodeChildren, oVNodeChildren).forEach((c, i) => {
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
    state = typeof updater === 'function' ? updater(state) : updater
    render()
  }
  return { update, run }
}
