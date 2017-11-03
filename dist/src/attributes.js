"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
function isEventAttribute(name) {
    return /^on/.test(name);
}
exports.isEventAttribute = isEventAttribute;
function extractEventName(name) {
    return name.slice(2).toLowerCase();
}
exports.extractEventName = extractEventName;
function addEventListener($el, name, event) {
    $el.addEventListener(extractEventName(name), event);
}
exports.addEventListener = addEventListener;
function updateEventListener($el, name, oldEvent, newEvent) {
    var hasChanged = newEvent !== oldEvent;
    if (newEvent === undefined || hasChanged) {
        removeEventListener($el, name, oldEvent);
    }
    if (newEvent || hasChanged) {
        addEventListener($el, name, newEvent);
    }
}
exports.updateEventListener = updateEventListener;
function removeEventListener($el, name, event) {
    $el.removeEventListener(extractEventName(name), event);
}
exports.removeEventListener = removeEventListener;
function addEventListeners($el, events) {
    if (events === void 0) { events = {}; }
    Object.keys(events)
        .filter(isEventAttribute)
        .forEach(function (name) { return addEventListener($el, name, events[name]); });
}
exports.addEventListeners = addEventListeners;
function updateEventListeners($el, oldEvents, newEvents) {
    if (oldEvents === void 0) { oldEvents = {}; }
    if (newEvents === void 0) { newEvents = {}; }
    Object.keys(__assign({}, newEvents, oldEvents))
        .filter(isEventAttribute)
        .forEach(function (name) { return updateEventListener($el, name, newEvents[name], oldEvents[name]); });
}
exports.updateEventListeners = updateEventListeners;
function addAttribute($el, name, value) {
    if (typeof value === 'boolean') {
        addBooleanAttribute($el, name, value);
    }
    else {
        $el.setAttribute(name, value);
    }
}
exports.addAttribute = addAttribute;
function addBooleanAttribute($el, name, value) {
    if (value) {
        $el.setAttribute(name, value.toString());
        $el[name] = true;
    }
    else {
        $el[name] = false;
    }
}
exports.addBooleanAttribute = addBooleanAttribute;
function updateAttribute($el, name, oldValue, newValue) {
    if (newValue === undefined) {
        removeAttribute($el, name, oldValue);
    }
    else if (oldValue === undefined || newValue !== oldValue) {
        addAttribute($el, name, newValue);
    }
}
exports.updateAttribute = updateAttribute;
function removeAttribute($el, name, value) {
    if (typeof value === 'boolean') {
        removeBooleanAttribute($el, name);
    }
    else {
        $el.removeAttribute(name);
    }
}
exports.removeAttribute = removeAttribute;
function removeBooleanAttribute($el, name) {
    $el.removeAttribute(name);
    $el[name] = false;
}
exports.removeBooleanAttribute = removeBooleanAttribute;
function addAttributes($el, props) {
    if (props === void 0) { props = {}; }
    Object.keys(props)
        .filter(function (key) { return !isEventAttribute(key); })
        .forEach(function (key) { return addAttribute($el, key, props[key]); });
}
exports.addAttributes = addAttributes;
function updateAttributes($el, newAttributes, oldAttributes) {
    if (newAttributes === void 0) { newAttributes = {}; }
    if (oldAttributes === void 0) { oldAttributes = {}; }
    Object.keys(__assign({}, oldAttributes, newAttributes))
        .filter(function (key) { return !isEventAttribute(key); })
        .forEach(function (key) { return updateAttribute($el, key, oldAttributes[key], newAttributes[key]); });
}
exports.updateAttributes = updateAttributes;
