import { View, h, app, Component } from '../../src'

window['counts'] = {
  render: 0,
}


const component = (count: number): Component => {
  return {
    state: {},
    onAfterMount(node, state, update) {
      const thirdPartyLibrary = document.createElement('div')
      thirdPartyLibrary.id = '3rd-party-library'
      thirdPartyLibrary.appendChild(thirdPartyLibrary)
    },
    shouldReplace() {
      return false
    },
    render(state, update) {
      return h('p', { id: 'component' }, [
        'Shouldnt render this'
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
