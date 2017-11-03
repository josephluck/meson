"use strict";
exports.__esModule = true;
var attributes = require("./attributes");
var utils = require("./utils");
function h(type, props, children) {
    return { type: type, props: props, children: children };
}
exports.h = h;
function createComponent($parent, component, index) {
    if (index === void 0) { index = 0; }
    var state = component.state;
    var update = function (updater) {
        state = typeof updater === 'function'
            ? updater(state)
            : updater;
        component.state = state;
        render();
    };
    function render() {
        var $oldNode = $parent.childNodes[index];
        var $newNode = createElement(component.render(state, update));
        if (utils.shouldComponentRender(component)) {
            if ($oldNode) {
                utils.lifecycle('onBeforeReplace', component);
                $parent.replaceChild($newNode, $oldNode);
                utils.lifecycle('onAfterReplace', component);
            }
            else {
                utils.lifecycle('onBeforeMount', component);
                $parent.appendChild($newNode);
                utils.lifecycle('onAfterMount', component);
            }
        }
    }
    component._update = update;
    return utils.shouldComponentRender(component)
        ? createElement(component.render(state, update))
        : document.createComment(' Component Placeholder '); // Should return null here... this seems hacky
}
function createElement(validVNode, $parent, index, create) {
    if (create === void 0) { create = false; }
    if (typeof validVNode === 'string' || typeof validVNode === 'number') {
        return document.createTextNode(validVNode.toString());
    }
    else if (utils.isVNode(validVNode)) {
        var vNode = validVNode;
        var $parent_1 = document.createElement(vNode.type);
        var children = (vNode.children instanceof Array ? vNode.children : [vNode.children])
            .filter(utils.isPresent);
        attributes.addAttributes($parent_1, vNode.props);
        attributes.addEventListeners($parent_1, vNode.props);
        if (create) {
            children
                .filter(utils.shouldComponentRender)
                .forEach(function (child) { return utils.lifecycle('onBeforeMount', child); });
        }
        children
            .map(function (child, i) { return utils.isComponent(child)
            ? createComponent($parent_1, child, i)
            : createElement(child); })
            .forEach($parent_1.appendChild.bind($parent_1));
        if (create) {
            children
                .filter(utils.shouldComponentRender)
                .forEach(function (child, i) { return utils.lifecycle('onAfterMount', child, $parent_1.childNodes[i]); });
        }
        return $parent_1;
    }
    else if (utils.isComponent(validVNode) && $parent) {
        return createComponent($parent, validVNode, index);
    }
}
function updateElement($parent, newVNode, oldVNode, index) {
    if (index === void 0) { index = 0; }
    var $child = $parent.childNodes[index];
    var vNodeRemoved = !utils.isPresent(newVNode) && utils.isPresent($child);
    var shouldComponentUnmount = utils.isComponent(newVNode) && utils.shouldComponentUnmount(newVNode);
    if (!utils.isPresent(oldVNode) && utils.isPresent(newVNode) && utils.shouldComponentRender(newVNode)) {
        utils.lifecycle('onBeforeMount', newVNode);
        var toAppend = createElement(newVNode, $parent, index, true);
        $parent.appendChild(toAppend);
        utils.lifecycle('onAfterMount', newVNode, toAppend);
    }
    else if (vNodeRemoved) {
        $parent.removeChild($child);
    }
    else if (shouldComponentUnmount) {
        utils.lifecycle('onBeforeUnmount', oldVNode, $child);
        $parent.replaceChild(document.createComment(' Component Placeholder '), $child); // This seems hacky to me...
        utils.lifecycle('onAfterUnmount', oldVNode);
    }
    else if (utils.hasVNodeChanged(newVNode, oldVNode)) {
        utils.lifecycle('onBeforeReplace', newVNode);
        $parent.replaceChild(createElement(newVNode), $child);
        utils.lifecycle('onAfterReplace', newVNode);
    }
    else if (utils.hasComponentChanged(newVNode, oldVNode)) {
        newVNode.state = oldVNode.state;
        utils.lifecycle('onBeforeReplace', newVNode);
        $parent.replaceChild(createElement(newVNode, $parent, index), $child);
        utils.lifecycle('onAfterReplace', newVNode);
    }
    else if (utils.isVNode(newVNode) && utils.isVNode(oldVNode)) {
        var nVNode = newVNode;
        var oVNode = oldVNode;
        var nVNodeChildren_1 = nVNode.children instanceof Array
            ? nVNode.children
            : [nVNode.children];
        var oVNodeChildren_1 = oVNode.children instanceof Array
            ? oVNode.children
            : [oVNode.children];
        attributes.updateAttributes($child, nVNode.props, oVNode.props);
        attributes.updateEventListeners($child, nVNode.props, oVNode.props);
        utils.getLargestArray(nVNodeChildren_1, oVNodeChildren_1)
            .forEach(function (c, i) { return updateElement($child, nVNodeChildren_1[i], oVNodeChildren_1[i], i); });
    }
}
function app(state) {
    var oldVNode;
    var app;
    var node;
    var render = function () {
        var newVNode = app(state, update);
        updateElement(node, newVNode, oldVNode);
        oldVNode = newVNode;
    };
    function run(elm, view) {
        app = view;
        node = typeof elm === 'string' ? document.querySelector(elm) : elm;
        render();
    }
    function update(updater) {
        state = typeof updater === 'function'
            ? updater(state)
            : updater;
        render();
    }
    return { update: update, run: run };
}
exports.app = app;
