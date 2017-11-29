import { h, View, app, Update, Component } from '../src'

export type State = {
  title: string
}

const defaultState: State = { title: 'Stateful components' }

interface Actions {
  updateTitle: (title: string) => any
}

function makeActions(update: Update<State>): Actions {
  return {
    updateTitle: title => update(state => ({ title })),
  }
}

const button = (text: string, onclick: () => any) => {
  return h('button', { onclick }, text)
}

const counter = (name: string): Component<{ count: number }> => {
  return {
    state: { count: 0 },
    onBeforeMount(state, update) {
      console.log('onBeforeMount', name)
    },
    onAfterMount(node, state, update) {
      node.innerHTML = '<span>Whoospy</span>'
      console.log('onAfterMount', name)
    },
    onBeforeUnmount(state, update) {
      console.log('onBeforeUnmount', name)
    },
    onAfterUnmount(state, update) {
      console.log('onAfterUnmount', name)
    },
    onBeforeReplace(state, update) {
      console.log('onBeforeReplace', name)
    },
    onAfterReplace(state, update) {
      console.log('onAfterReplace', name)
    },
    shouldReplace() {
      return false
    },
    render(state, update) {
      return h('div', { id: `counter-${name}`, style: 'margin: 10px' }, [
        button('decrement', () => update({ count: state.count - 1 })),
        h('span', { id: state.count }, `${state.count} for ${name}`),
        button('increment', () => update({ count: state.count + 1 })),
        null,
      ])
    },
  }
}

const conditionalCounter: Component<{ showing: boolean }> = {
  state: { showing: false },
  onBeforeMount(state, update) {
    console.log('onBeforeMount conditional-counter')
  },
  onBeforeUnmount(node, state, update) {
    console.log('onBeforeUnmount conditional-counter')
  },
  onAfterUnmount(state, update) {
    console.log('onAfterUnmount conditional-counter')
  },
  onBeforeReplace(state, update) {
    console.log('onBeforeReplace conditional-counter')
  },
  onAfterReplace(state, update) {
    console.log('onAfterReplace conditional-counter')
  },
  render(state, update) {
    return h(
      'div',
      { id: 'conditional-counter', style: 'margin: 10px; border: solid 1px' },
      [
        state.showing ? counter('inside-conditional-counter-1') : null,
        button('toggle counter', () => update({ showing: !state.showing })),
        state.showing ? counter('inside-conditional-counter-2') : null,
      ],
    )
  },
}

const view = (actions: Actions): View<State> => state => {
  return h('div', { id: 'container' }, [
    counter(state.title),
    conditionalCounter,
    h('div', { style: 'margin: 10px; border: solid 1px' }, [
      h('input', {
        value: state.title,
        oninput: e => actions.updateTitle(e.target.value),
      }),
      state.title,
    ]),
    counter('counter-2'),
    state.title === '' ? conditionalCounter : null,
    null,
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
