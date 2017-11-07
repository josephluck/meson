import { View, h, app, Component } from '../../src'

window['counts'] = {
  render: 0,
  componentRender: 0,
  onBeforeMount: 0,
  onAfterMount: 0,
  onBeforeReplace: 0,
  onAfterReplace: 0,
  onBeforeUnmount: 0,
  onAfterUnmount: 0,
}


const component = (count: number): Component<{ count: number }> => {
  return {
    state: {
      count: 0
    },
    onBeforeMount() {
      window['counts'].onBeforeMount++
    },
    onAfterMount() {
      window['counts'].onAfterMount++
    },
    onBeforeReplace() {
      window['counts'].onBeforeReplace++
    },
    onAfterReplace() {
      window['counts'].onAfterReplace++
    },
    onBeforeUnmount() {
      window['counts'].onBeforeUnmount++
    },
    onAfterUnmount() {
      window['counts'].onAfterUnmount++
    },
    render(state, update) {
      window['counts'].componentRender++
      return h('p', { id: 'component' }, [
        h('span', { id: 'component-onBeforeMount-count' }, window['counts'].onBeforeMount),
        h('span', { id: 'component-onAfterMount-count' }, window['counts'].onAfterMount),
        h('span', { id: 'component-onBeforeReplace-count' }, window['counts'].onBeforeReplace),
        h('span', { id: 'component-onAfterReplace-count' }, window['counts'].onAfterReplace),
        h('span', { id: 'component-onBeforeUnmount-count' }, window['counts'].onBeforeUnmount),
        h('span', { id: 'component-onAfterUnmount-count' }, window['counts'].onAfterUnmount),
        h('span', { id: 'component-render-count' }, window['counts'].render),
        h('button', { id: 'component-decrement-button', onclick: () => update({ count: state.count - 1 }) }, 'Decrement'),
        h('span', { id: 'component-state-count' }, state.count),
        'Ahh!'
      ])
    }
  }
}

export type State = {
  count: number
}

const defaultState: State = { count: 0 }

const view: View<State> = (state = defaultState, update) => {
  window['counts'].render++
  const increment = () => update({ count: state.count + 1 })
  return h('div', {}, [
    h('span', { id: 'count' }, state.count),
    h('button', { id: 'increment-button', onclick: increment }, 'Increment'),
    component(state.count)
  ])
}

const node = document.createElement('div')
document.body.appendChild(node)
const { run } = app(defaultState)
run(node, view)
