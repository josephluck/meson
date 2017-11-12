import { View, h, app, Component } from '../../src'

let renderCount = 0

export type State = {
  count: number
}

const defaultState: State = { count: 0 }

const component: Component<{}> = {
  state: {},
  render() {
    return h('p', { id: 'conditional-component' }, 'Ahh!')
  }
}

const view: View<State> = (state = defaultState, update) => {
  renderCount++
  const increment = () => update({ count: state.count + 1 })
  return h('div', {}, [
    // h('span', { id: 'render-count' }, renderCount),
    // h('span', { id: 'count' }, state.count),
    h('button', { id: 'increment-button', onclick: increment }, 'Increment'),
    state.count === 1 ? h('p', { id: 'conditional-element' }, 'Boo!') : h('span'),
    state.count === 2 ? component : h('span'),
    h('span', { id: 'should-persist-this-element' }, 'Should persist this element')
  ])
}

const node = document.createElement('div')
document.body.appendChild(node)
const { run } = app(defaultState)
run(node, view)
