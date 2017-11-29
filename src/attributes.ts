export function isEventAttribute(name: string): boolean {
  return /^on/.test(name)
}

export function extractEventName(name: string): string {
  return name.slice(2).toLowerCase()
}

export function addEventListener($el: HTMLElement, name: string, event: any) {
  $el.addEventListener(extractEventName(name), event)
}

export function updateEventListener(
  $el: HTMLElement,
  name: string,
  oldEvent: any,
  newEvent: any,
) {
  const hasChanged = newEvent !== oldEvent
  if (newEvent === undefined || hasChanged) {
    removeEventListener($el, name, oldEvent)
  }
  if (newEvent || hasChanged) {
    addEventListener($el, name, newEvent)
  }
}

export function removeEventListener(
  $el: HTMLElement,
  name: string,
  event: any,
) {
  $el.removeEventListener(extractEventName(name), event)
}

export function addEventListeners($el: HTMLElement, events: any = {}) {
  Object.keys(events)
    .filter(isEventAttribute)
    .forEach(name => addEventListener($el, name, events[name]))
}

export function updateEventListeners(
  $el: HTMLElement,
  oldEvents: any = {},
  newEvents: any = {},
) {
  Object.keys({ ...newEvents, ...oldEvents })
    .filter(isEventAttribute)
    .forEach(name =>
      updateEventListener($el, name, newEvents[name], oldEvents[name]),
    )
}

export function addAttribute($el: HTMLElement, name: string, value: any) {
  if (typeof value === 'boolean') {
    addBooleanAttribute($el, name, value)
  } else {
    $el.setAttribute(name, value)
  }
}

export function addBooleanAttribute(
  $el: HTMLElement,
  name: string,
  value: boolean,
) {
  if (value) {
    $el.setAttribute(name, value.toString())
    $el[name] = true
  } else {
    $el[name] = false
  }
}

export function updateAttribute(
  $el: HTMLElement,
  name: string,
  oldValue: any,
  newValue: any,
) {
  if (newValue === undefined) {
    removeAttribute($el, name, oldValue)
  } else if (oldValue === undefined || newValue !== oldValue) {
    addAttribute($el, name, newValue)
  }
}

export function removeAttribute($el: HTMLElement, name: string, value: any) {
  if (typeof value === 'boolean') {
    removeBooleanAttribute($el, name)
  } else {
    $el.removeAttribute(name)
  }
}

export function removeBooleanAttribute($el: HTMLElement, name: string) {
  $el.removeAttribute(name)
  $el[name] = false
}

export function addAttributes($el: HTMLElement, props: any = {}) {
  Object.keys(props)
    .filter(key => !isEventAttribute(key))
    .forEach(key => addAttribute($el, key, props[key]))
}

export function updateAttributes(
  $el: HTMLElement,
  newAttributes: any = {},
  oldAttributes: any = {},
) {
  Object.keys({ ...oldAttributes, ...newAttributes })
    .filter(key => !isEventAttribute(key))
    .forEach(key =>
      updateAttribute($el, key, oldAttributes[key], newAttributes[key]),
    )
}
