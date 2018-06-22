/*
 * PointerEvent
 * https://github.com/anseki/pointer-event
 *
 * Copyright (c) 2018 anseki
 * Licensed under the MIT license.
 */

import AnimEvent from 'anim-event';

const DUPLICATE_INTERVAL = 400; // For avoiding mouse event that fired by touch interface

// Support options for addEventListener
let passiveSupported = false;
try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get() { passiveSupported = true; }
  }));
} catch (error) { /* ignore */ }

function addEventListenerWithOptions(target, type, handler, options) {
  // When `passive` is not supported, consider that the `useCapture` is supported instead of
  // `options` (i.e. options other than the `passive` also are not supported).
  target.addEventListener(type, handler, passiveSupported ? options : options.capture);
}

// Gecko, Trident pick drag-event of some elements such as img, a, etc.
function dragstart(event) { event.preventDefault(); }

class PointerEvent {
  /**
   * Create a `PointerEvent` instance.
   */
  constructor() {
    this.startHandlers = {};
    this.handlerId = 0;
    this.curPointerClass = null;
    this.lastPointerXY = {clientX: 0, clientY: 0};
    this.lastStartTime = 0;
  }

  /**
   * @param {function} startHandler - This is called with pointerXY when it starts. This returns boolean.
   * @returns {number} handlerId which is used for adding/removing to element.
   */
  regStartHandler(startHandler) {
    const that = this;
    that.startHandlers[++that.handlerId] = event => {
      const pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
        pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0],
        now = Date.now();
      if (that.curPointerClass && pointerClass !== that.curPointerClass &&
          now - that.lastStartTime < DUPLICATE_INTERVAL) {
        console.log(`Event "${event.type}" was ignored.`); // [DEBUG/]
        return;
      }
      if (startHandler(pointerXY)) {
        that.curPointerClass = pointerClass;
        that.lastPointerXY.clientX = pointerXY.clientX;
        that.lastPointerXY.clientY = pointerXY.clientY;
        that.lastStartTime = now;
        event.preventDefault();
      }
    };
    return that.handlerId;
  }

  /**
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {void}
   */
  unregStartHandler(handlerId) { delete this.startHandlers[handlerId]; }

  /**
   * @param {Element} element - A target element.
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {void}
   */
  addStartHandler(element, handlerId) {
    addEventListenerWithOptions(element, 'mousedown', this.startHandlers[handlerId],
      {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchstart', this.startHandlers[handlerId],
      {capture: false, passive: false});
    addEventListenerWithOptions(element, 'dragstart', dragstart, {capture: false, passive: false});
  }

  /**
   * @param {Element} element - A target element.
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {void}
   */
  removeStartHandler(element, handlerId) {
    element.removeEventListener('mousedown', this.startHandlers[handlerId], false);
    element.removeEventListener('touchstart', this.startHandlers[handlerId], false);
    element.removeEventListener('dragstart', dragstart, false);
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} moveHandler - This is called with pointerXY when it moves.
   * @returns {void}
   */
  addMoveHandler(element, moveHandler) {
    const that = this;
    const pointerMove = AnimEvent.add(event => {
      const pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch',
        pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];
      if (pointerClass === that.curPointerClass) {
        moveHandler(pointerXY);
        that.lastPointerXY.clientX = pointerXY.clientX;
        that.lastPointerXY.clientY = pointerXY.clientY;
        event.preventDefault();
      }
    });
    addEventListenerWithOptions(element, 'mousemove', pointerMove, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchmove', pointerMove, {capture: false, passive: false});
    that.curMoveHandler = moveHandler;
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} endHandler - This is called when it ends.
   * @returns {void}
   */
  addEndHandler(element, endHandler) {
    const that = this;
    function pointerEnd(event) {
      const pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch';
      if (pointerClass === that.curPointerClass) {
        endHandler();
        that.curPointerClass = null;
        event.preventDefault();
      }
    }
    addEventListenerWithOptions(element, 'mouseup', pointerEnd, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchend', pointerEnd, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchcancel', pointerEnd, {capture: false, passive: false});
  }

  callMoveHandler() {
    if (this.curMoveHandler) { this.curMoveHandler(this.lastPointerXY); }
  }
}

export default PointerEvent;
