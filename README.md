# Meson

A minimum viable front-end framework with added virtual DOM + stateful components

## Why?

Don't use this :-) It's really just an indulgent idea of how small a UI framework + virtual DOM + stateful components can be. It's slightly better than [Xi](http://github.com/josephluck/xi), but is good for... well, nothing much of anything really.

## Overview

Meson has only a few concepts:

### Views

Views render HTML elements to the page:

```javascript
h('div', { id: 'meson-app' }, 'Meson is super small!') // --> <div id='Meson-app'>Meson is super small</div> 
```

### State

State is a single global state atom, a'la Redux and friends. You can update state with the convenient `updateState` function passed in to all views.

```javascript
function view (state = { title: 'Meson is cool' }, update) {
  const updateTitle = () => update({title: 'Meson is AWESOME'})
  return h('div', { onclick: updateTitle }, state.title)
}
```

### Components

There's components in Meson... Take a gander:

```javascript
const counter = (name: string) => {
  return {
    state: { count: 0 },
    onBeforeMount(state, update) {
      console.log('onBeforeMount', name)
    },
    onAfterMount(state, update) {
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
    shouldRender() {
      console.log('shouldRender', name)
      return true
    },
    render(state, update) {
      return h('div', { id: `counter-${name}` }, [
        h('button', { onclick: () => update({ count: state.count - 1 }) }, 'Decrement'),
        h('span', { id: state.count }, `${state.count} for ${name}`),
        h('button', { onclick: () => update({ count: state.count + 1 }) }, 'Increment'),
        null
      ])
    }
  }
}
function view (state = { title: 'Meson is cool' }, update) {
  const updateTitle = () => update({title: 'Meson is AWESOME'})
  return h('div', {}, [
    counter('two'),
    h('div', { onclick: updateTitle }, state.title),
    counter('one'),
  ]) 
}
```

## Example Usage

See the `examples` folder for a few ideas.

## Performance

Eh, go use React or something better :wink:
