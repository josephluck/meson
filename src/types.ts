export interface VNode {
  type: keyof HTMLElementTagNameMap
  props?: any
  children?: ValidVNode | ValidVNode[]
}
export interface Component<S = any> {
  state: S
  render: View<S>
  onBeforeMount?: OnBeforeMount<S>
  onAfterMount?: OnAfterMount<S>
  onBeforeUnmount?: OnBeforeUnmount<S>
  onAfterUnmount?: OnAfterUnmount<S>
  onBeforeReplace?: OnBeforeReplace<S>
  onAfterReplace?: OnAfterReplace<S>
  shouldMount?: (state: S) => boolean
  shouldReplace?: (state: S) => boolean
  _update?: Updater<S>
}
export type ValidLifecycleMethods =
  | 'onBeforeMount'
  | 'onAfterMount'
  | 'onBeforeUnmount'
  | 'onAfterUnmount'
  | 'onBeforeReplace'
  | 'onAfterReplace'
export type ValidVNode<S = any> = Component<S> | VNode | string | number
export type Updater<S> = (state: S) => S
export type Update<S> = (updater: S | Updater<S>) => any
export type View<S> = (state: S, update: Update<S>) => ValidVNode
export type OnBeforeMount<S> = (state: S, update: Update<S>) => any
export type OnAfterMount<S> = (
  node: HTMLElement,
  state: S,
  update: Update<S>,
) => any
export type OnBeforeReplace<S> = (state: S, update: Update<S>) => any
export type OnAfterReplace<S> = (state: S, update: Update<S>) => any
export type OnBeforeUnmount<S> = (
  node: HTMLElement,
  state: S,
  update: Update<S>,
) => any
export type OnAfterUnmount<S> = (state: S, update: Update<S>) => any
export type Lifecycle<S> =
  | OnBeforeMount<S>
  | OnAfterMount<S>
  | OnBeforeReplace<S>
  | OnAfterReplace<S>
  | OnBeforeUnmount<S>
  | OnAfterUnmount<S>
export type State = Record<string, any>
