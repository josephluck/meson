import { View, h, app } from '../src'

export type MyState = {
  title: string
}

const defaultState: MyState = { title: 'Hello' }

const view: View<MyState> = (state = defaultState, update) => {
  const updateTitle = () => {
    update({ title: Date.now().toString() })
  }
  return h('div', {
    id: 'my-div',
    onclick: updateTitle,
  }, [state.title])
}

export default function () {
  const node = document.createElement('div')
  node.style.margin = '100px'
  document.body.appendChild(node)
  const { run } = app(defaultState)
  run(node, view)
}
