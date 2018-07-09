/* ================================================
        DON'T MANUALLY EDIT THIS FILE
================================================ */

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
   * @param {Object} [options] - Options
   */
  constructor(options) {
    this.startHandlers = {};
    this.lastHandlerId = 0;
    this.curPointerClass = null;
    this.lastPointerXY = {clientX: 0, clientY: 0};
    this.lastStartTime = 0;

    // Options
    this.options = { // Default
      preventDefault: true,
      stopPropagation: true
    };
    if (options) {
      ['preventDefault', 'stopPropagation'].forEach(option => {
        if (typeof options[option] === 'boolean') {
          this.options[option] = options[option];
        }
      });
    }
  }

  /**
   * @param {function} startHandler - This is called with pointerXY when it starts. This returns boolean.
   * @returns {number} handlerId which is used for adding/removing to element.
   */
  regStartHandler(startHandler) {
    const that = this;
    that.startHandlers[++that.lastHandlerId] = event => {
      const pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
        pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0],
        now = Date.now();
      if (that.curPointerClass && pointerClass !== that.curPointerClass &&
          now - that.lastStartTime < DUPLICATE_INTERVAL) {
        return;
      }
      if (startHandler(pointerXY)) {
        that.curPointerClass = pointerClass;
        that.lastPointerXY.clientX = pointerXY.clientX;
        that.lastPointerXY.clientY = pointerXY.clientY;
        that.lastStartTime = now;
        if (that.options.preventDefault) { event.preventDefault(); }
        if (that.options.stopPropagation) { event.stopPropagation(); }
      }
    };
    return that.lastHandlerId;
  }

  /**
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {void}
   */
  unregStartHandler(handlerId) { delete this.startHandlers[handlerId]; }

  /**
   * @param {Element} element - A target element.
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {number} handlerId which was passed.
   */
  addStartHandler(element, handlerId) {
    if (!this.startHandlers[handlerId]) { throw new Error(`Invalid handlerId: ${handlerId}`); }
    addEventListenerWithOptions(element, 'mousedown', this.startHandlers[handlerId],
      {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchstart', this.startHandlers[handlerId],
      {capture: false, passive: false});
    addEventListenerWithOptions(element, 'dragstart', dragstart, {capture: false, passive: false});
    return handlerId;
  }

  /**
   * @param {Element} element - A target element.
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {number} handlerId which was passed.
   */
  removeStartHandler(element, handlerId) {
    if (!this.startHandlers[handlerId]) { throw new Error(`Invalid handlerId: ${handlerId}`); }
    element.removeEventListener('mousedown', this.startHandlers[handlerId], false);
    element.removeEventListener('touchstart', this.startHandlers[handlerId], false);
    element.removeEventListener('dragstart', dragstart, false);
    return handlerId;
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} moveHandler - This is called with pointerXY when it moves.
   * @returns {void}
   */
  addMoveHandler(element, moveHandler) {
    const that = this;
    const wrappedHandler = AnimEvent.add(event => {
      const pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch',
        pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];
      if (pointerClass === that.curPointerClass) {
        that.move(pointerXY);
        if (that.options.preventDefault) { event.preventDefault(); }
        if (that.options.stopPropagation) { event.stopPropagation(); }
      }
    });
    addEventListenerWithOptions(element, 'mousemove', wrappedHandler, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchmove', wrappedHandler, {capture: false, passive: false});
    that.curMoveHandler = moveHandler;
  }

  /**
   * @param {{clientX, clientY}} [pointerXY] - This might be MouseEvent, Touch of TouchEvent or Object.
   * @returns {void}
   */
  move(pointerXY) {
    if (this.curMoveHandler) {
      if (!pointerXY) { pointerXY = this.lastPointerXY; }
      this.curMoveHandler(pointerXY);
      this.lastPointerXY.clientX = pointerXY.clientX;
      this.lastPointerXY.clientY = pointerXY.clientY;
    }
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} endHandler - This is called when it ends.
   * @returns {void}
   */
  addEndHandler(element, endHandler) {
    const that = this;
    function wrappedHandler(event) {
      const pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch';
      if (pointerClass === that.curPointerClass) {
        that.end();
        if (that.options.preventDefault) { event.preventDefault(); }
        if (that.options.stopPropagation) { event.stopPropagation(); }
      }
    }
    addEventListenerWithOptions(element, 'mouseup', wrappedHandler, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchend', wrappedHandler, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchcancel', wrappedHandler, {capture: false, passive: false});
    that.curEndHandler = endHandler;
  }

  /**
   * @returns {void}
   */
  end() {
    if (this.curEndHandler) {
      this.curEndHandler();
      this.curPointerClass = null;
    }
  }
}

export default PointerEvent;
