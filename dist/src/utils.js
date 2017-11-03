"use strict";
exports.__esModule = true;
function hasVNodeChanged(nodeA, nodeB) {
    var typeHasChanged = typeof nodeA !== typeof nodeB;
    var stringHasChanged = typeof nodeA === 'string' && nodeA !== nodeB;
    var numberHasChanged = typeof nodeA === 'number' && nodeA !== nodeB;
    var vNodeTypeHasChanged = isVNode(nodeA) && isVNode(nodeB) && (nodeA.type !== nodeB.type);
    return typeHasChanged || stringHasChanged || numberHasChanged || vNodeTypeHasChanged;
}
exports.hasVNodeChanged = hasVNodeChanged;
function hasComponentChanged(newComponent, oldComponent) {
    return shouldComponentRender(newComponent) && isComponent(newComponent) && isComponent(oldComponent);
}
exports.hasComponentChanged = hasComponentChanged;
function isVNode(node) {
    return isPresent(node) && node.type && typeof node !== 'string' && typeof node !== 'number';
}
exports.isVNode = isVNode;
function isPresent(node) {
    return node !== null && node !== undefined;
}
exports.isPresent = isPresent;
function isComponent(vNode) {
    return isPresent(vNode) && !!vNode.render;
}
exports.isComponent = isComponent;
function getLargestArray(a, b) {
    return a.length > b.length ? a : b;
}
exports.getLargestArray = getLargestArray;
function lifecycle(method, vNode, $node) {
    if (isComponent(vNode) && vNode[method]) {
        if (method === 'onAfterMount' || method === 'onBeforeUnmount') {
            vNode[method]($node, vNode.state, vNode._update);
        }
        else {
            vNode[method](vNode.state, vNode._update);
        }
    }
}
exports.lifecycle = lifecycle;
function shouldComponentRender(node) {
    return isComponent(node) && node.shouldRender ? node.shouldRender() : true;
}
exports.shouldComponentRender = shouldComponentRender;
function shouldComponentUnmount(node) {
    return isComponent(node) && node.shouldRender
        ? !node.shouldRender()
        : false;
}
exports.shouldComponentUnmount = shouldComponentUnmount;
