export interface VNode {
    type: keyof HTMLElementTagNameMap;
    props?: any;
    children?: ValidVNode | ValidVNode[];
}
export interface Component<S> {
    state: S;
    render: View<S>;
    onBeforeMount?: OnBeforeMount<S>;
    onAfterMount?: OnAfterMount<S>;
    onBeforeUnmount?: OnBeforeUnmount<S>;
    onAfterUnmount?: OnAfterUnmount<S>;
    onBeforeReplace?: OnBeforeReplace<S>;
    onAfterReplace?: OnAfterReplace<S>;
    shouldRender?: () => boolean;
    _update?: Updater<S>;
}
export declare type ValidLifecycleMethods = 'onBeforeMount' | 'onAfterMount' | 'onBeforeUnmount' | 'onAfterUnmount' | 'onBeforeReplace' | 'onAfterReplace';
export declare type ValidVNode<S = any> = Component<S> | VNode | string | number;
export declare type Updater<S> = (state: S) => S;
export declare type Update<S> = (updater: S | Updater<S>) => any;
export declare type View<S> = (state: S, update: Update<S>) => ValidVNode;
export declare type OnBeforeMount<S> = (state: S, update: Update<S>) => any;
export declare type OnAfterMount<S> = (node: HTMLElement, state: S, update: Update<S>) => any;
export declare type OnBeforeReplace<S> = (state: S, update: Update<S>) => any;
export declare type OnAfterReplace<S> = (state: S, update: Update<S>) => any;
export declare type OnBeforeUnmount<S> = (node: HTMLElement, state: S, update: Update<S>) => any;
export declare type OnAfterUnmount<S> = (state: S, update: Update<S>) => any;
export declare type Lifecycle<S> = OnBeforeMount<S> | OnAfterMount<S> | OnBeforeReplace<S> | OnAfterReplace<S> | OnBeforeUnmount<S> | OnAfterUnmount<S>;
export declare type State = Record<string, any>;
