import { pointerCoord, hasPointerMoved } from '../../util/dom';
import { Activator } from './activator';
import { RippleActivator } from './ripple';
let startCoord = null;
let pointerTolerance = 4;
let lastTouch = 0;
let lastActivated = 0;
let disableNativeClickTime = 0;
let disableNativeClickLimit = 1000;
let activator = null;
let isTapPolyfill = false;
let app = null;
let config = null;
let win = null;
let doc = null;
export function initTapClick(windowInstance, documentInstance, appInstance, configInstance) {
    win = windowInstance;
    doc = documentInstance;
    app = appInstance;
    config = configInstance;
    activator = (config.get('mdRipple') ? new RippleActivator(app, config) : new Activator(app, config));
    isTapPolyfill = (config.get('tapPolyfill') === true);
    addListener('click', click, true);
    if (isTapPolyfill) {
        addListener('touchstart', touchStart);
        addListener('touchend', touchEnd);
        addListener('touchcancel', touchCancel);
    }
    addListener('mousedown', mouseDown, true);
    addListener('mouseup', mouseUp, true);
}
function touchStart(ev) {
    touchAction();
    pointerStart(ev);
}
function touchEnd(ev) {
    touchAction();
    if (startCoord && app.isEnabled()) {
        let endCoord = pointerCoord(ev);
        if (!hasPointerMoved(pointerTolerance, startCoord, endCoord)) {
            console.debug('create click from touch');
            setDisableNativeClick();
            ;
            let clickEvent = doc.createEvent('MouseEvents');
            clickEvent.initMouseEvent('click', true, true, win, 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
            clickEvent.isIonicTap = true;
            ev.target.dispatchEvent(clickEvent);
        }
    }
    pointerEnd(ev);
}
function touchCancel(ev) {
    touchAction();
    pointerCancel(ev);
}
function mouseDown(ev) {
    if (isDisabledNativeClick()) {
        console.debug('mouseDown prevent');
        ev.preventDefault();
        ev.stopPropagation();
    }
    else if (lastTouch + disableNativeClickLimit < Date.now()) {
        pointerStart(ev);
    }
}
function mouseUp(ev) {
    if (isDisabledNativeClick()) {
        console.debug('mouseUp prevent');
        ev.preventDefault();
        ev.stopPropagation();
    }
    if (lastTouch + disableNativeClickLimit < Date.now()) {
        pointerEnd(ev);
    }
}
function pointerStart(ev) {
    let activatableEle = getActivatableTarget(ev.target);
    if (activatableEle) {
        startCoord = pointerCoord(ev);
        let now = Date.now();
        if (lastActivated + 100 < now) {
            activator.downAction(ev, activatableEle, startCoord.x, startCoord.y);
            lastActivated = now;
        }
        moveListeners(true);
    }
    else {
        startCoord = null;
    }
}
function pointerEnd(ev) {
    moveListeners(false);
    activator.upAction();
}
function pointerMove(ev) {
    let moveCoord = pointerCoord(ev);
    if (hasPointerMoved(10, startCoord, moveCoord)) {
        pointerCancel(ev);
    }
}
function pointerCancel(ev) {
    console.debug('pointerCancel from', ev.type);
    activator.clearState();
    moveListeners(false);
    setDisableNativeClick();
}
function moveListeners(shouldAdd) {
    if (isTapPolyfill) {
        removeListener('touchmove', pointerMove);
    }
    removeListener('mousemove', pointerMove);
    if (shouldAdd) {
        if (isTapPolyfill) {
            addListener('touchmove', pointerMove);
        }
        addListener('mousemove', pointerMove);
    }
}
function setDisableNativeClick() {
    if (isTapPolyfill) {
        disableNativeClickTime = Date.now() + disableNativeClickLimit;
    }
}
function isDisabledNativeClick() {
    return disableNativeClickTime > Date.now();
}
function click(ev) {
    let preventReason = null;
    if (!app.isEnabled()) {
        preventReason = 'appDisabled';
    }
    else if (!ev.isIonicTap && isDisabledNativeClick()) {
        preventReason = 'nativeClick';
    }
    if (preventReason !== null) {
        console.debug('click prevent', preventReason);
        ev.preventDefault();
        ev.stopPropagation();
    }
    else {
        activator.upAction();
    }
}
function getActivatableTarget(ele) {
    let targetEle = ele;
    for (let x = 0; x < 4; x++) {
        if (!targetEle)
            break;
        if (isActivatable(targetEle))
            return targetEle;
        targetEle = targetEle.parentElement;
    }
    return null;
}
export function isActivatable(ele) {
    if (ACTIVATABLE_ELEMENTS.test(ele.tagName)) {
        return true;
    }
    let attributes = ele.attributes;
    for (let i = 0, l = attributes.length; i < l; i++) {
        if (ACTIVATABLE_ATTRIBUTES.test(attributes[i].name)) {
            return true;
        }
    }
    return false;
}
function touchAction() {
    lastTouch = Date.now();
}
function addListener(type, listener, useCapture) {
    doc.addEventListener(type, listener, useCapture);
}
function removeListener(type, listener) {
    doc.removeEventListener(type, listener);
}
const ACTIVATABLE_ELEMENTS = /^(A|BUTTON)$/;
const ACTIVATABLE_ATTRIBUTES = /tappable/;