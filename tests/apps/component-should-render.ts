import { View, h, app, Component } from '../../src'

let renderCounts = {
  app: 0,
  component: 0,
}

const component = (count: number): Component<{}> => {
  return {
    state: {},
    shouldMount() {
      return count === 1
    },
    render() {
      renderCounts.component++
      return h('p', { id: 'conditional-component' }, [
        h('span', { id: 'component-render-count' }, renderCounts.component),
        'Ahh!',
      ])
    },
  }
}

export type State = {
  count: number
}

const defaultState: State = { count: 0 }

const view: View<State> = (state = defaultState, update) => {
  renderCounts.app++
  const increment = () => update({ count: state.count + 1 })
  return h('div', {}, [
    h('span', { id: 'render-count' }, renderCounts.app),
    h('span', { id: 'count' }, state.count),
    h('button', { id: 'increment-button', onclick: increment }, 'Increment'),
    component(state.count),
  ])
}

const node = document.createElement('div')
document.body.appendChild(node)
const { run } = app(defaultState)
run(node, view)
