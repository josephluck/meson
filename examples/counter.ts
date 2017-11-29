import { h, View, app, Update } from '../src'

export type State = {
  count: number
}

const defaultState: State = { count: 5 }

interface Actions {
  increment: () => any
  decrement: () => any
}

function makeActions(update: Update<State>): Actions {
  return {
    increment: () => update(state => ({ count: state.count + 1 })),
    decrement: () => update(state => ({ count: state.count - 1 })),
  }
}

const button = (text: string, onclick: () => any) => {
  return h('button', { onclick }, text)
}

const view = (actions: Actions): View<State> => state => {
  return h('div', {}, [
    h('div', {}, [
      button('decrement', actions.decrement),
      h('span', { id: state.count }, state.count),
      button('increment', actions.increment),
      null,
    ]),
  ])
}

export default function() {
  const node = document.createElement('div')
  node.style.margin = '100px'
  document.body.appendChild(node)
  const { update, run } = app(defaultState)
  const actions = makeActions(update)
  run(node, view(actions))
}
