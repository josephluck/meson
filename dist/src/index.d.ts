import * as Types from './types';
export { View, Update, Component } from './types';
export declare function h(type: keyof HTMLElementTagNameMap, props?: any, children?: Types.ValidVNode | Types.ValidVNode[]): Types.VNode;
export declare function app<S>(state: S): {
    update: (updater: Types.Updater<S>) => void;
    run: (elm: string | HTMLElement, view: Types.View<S>) => void;
};
