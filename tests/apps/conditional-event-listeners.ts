import { View, h, app } from '../../src'

let renderCount = 0

export type State = {
  count: number
}

const defaultState: State = { count: 0 }

const view: View<State> = (state = defaultState, update) => {
  renderCount++
  const increment = () => update({ count: state.count + 1 })
  return h('div', {}, [
    h('span', { id: 'render-count' }, renderCount),
    h('span', { id: 'count' }, state.count),
    h(
      'button',
      {
        id: 'increment-button',
        onclick: state.count === 0 ? increment : undefined,
      },
      'Increment',
    ),
  ])
}

const node = document.createElement('div')
document.body.appendChild(node)
const { run } = app(defaultState)
run(node, view)
