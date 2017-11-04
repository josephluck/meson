import { View, h, app, Component } from '../../src'

let renderCounts = {
  app: 0,
  one: 0,
  two: 0,
  three: 0,
}

const counter = (name: string): Component<{ count: number }> => {
  return {
    state: { count: 0 },
    render(state, update) {
      renderCounts[name]++
      const decrement = () => update({ count: state.count - 1 })
      const increment = () => update({ count: state.count + 1 })
      return h('div', {}, [
        h('span', { id: `render-count-counter-${name}` }, renderCounts[name]),
        h('button', { id: `decrement-button-${name}`, onclick: decrement }, 'Decrement'),
        h('span', { id: `count-${name}` }, state.count),
        h('button', { id: `increment-button-${name}`, onclick: increment }, 'Increment'),
      ])
    }
  }
}

export type State = {
  title: string
}

const view: View<State> = (state, update) => {
  renderCounts.app++
  const updateTitle = (e) => update({ title: e.target.value })
  return h('div', {}, [
    h('span', { id: 'render-count-app' }, renderCounts.app),
    h('input', { id: 'update-title', oninput: updateTitle }),
    h('span', { id: 'title' }, state.title),
    counter('one'),
    counter('two'),
    counter('three'),
  ])
}

const node = document.createElement('div')
document.body.appendChild(node)
const { run } = app({ title: 'Meson' })
run(node, view)
