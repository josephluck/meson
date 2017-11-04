import { View, h, app } from '../../src'

export type MyState = {
  title: string
}

const defaultState: MyState = { title: 'Hello World' }

const view: View<MyState> = (state = defaultState, update) => {
  return h('div', {}, [state.title])
}

const node = document.createElement('div')
document.body.appendChild(node)
const { run } = app(defaultState)
run(node, view)
