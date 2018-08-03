/*
 * PointerEvent
 * https://github.com/anseki/pointer-event
 *
 * Copyright (c) 2018 anseki
 * Licensed under the MIT license.
 */

import AnimEvent from 'anim-event';

const MOUSE_EMU_INTERVAL = 400; // Avoid mouse events emulation

// [DEBUG]
const traceLog = [];
// [/DEBUG]

// Support options for addEventListener
let passiveSupported = false;
try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get() { passiveSupported = true; }
  }));
} catch (error) { /* ignore */ }

/**
 * addEventListener with specific option.
 * @param {Element} target - An event-target element.
 * @param {string} type - The event type to listen for.
 * @param {function} listener - The EventListener.
 * @param {Object} options - An options object.
 * @returns {void}
 */
function addEventListenerWithOptions(target, type, listener, options) {
  // When `passive` is not supported, consider that the `useCapture` is supported instead of
  // `options` (i.e. options other than the `passive` also are not supported).
  target.addEventListener(type, listener, passiveSupported ? options : options.capture);
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
    this.lastTouchTime = 0;

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
      traceLog.push('<startListener>', `type:${event.type}`); // [DEBUG/]
      traceLog.push(`curPointerClass:${that.curPointerClass}`); // [DEBUG/]
      const pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
        pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0],
        now = Date.now();

      // Avoid mouse events emulation
      if (pointerClass === 'touch') {
        that.lastTouchTime = now;
      } else if (now - that.lastTouchTime < MOUSE_EMU_INTERVAL) {
        console.warn(`Event "${event.type}" was ignored.`); // [DEBUG/]
        traceLog.push('CANCEL', '</startListener>'); // [DEBUG/]
        return;
      }

      if (startHandler.call(that, pointerXY)) {
        that.curPointerClass = pointerClass;
        traceLog.push(`curPointerClass:${that.curPointerClass}`); // [DEBUG/]
        that.lastPointerXY.clientX = pointerXY.clientX;
        that.lastPointerXY.clientY = pointerXY.clientY;
        traceLog.push(`lastPointerXY:(${that.lastPointerXY.clientX},${that.lastPointerXY.clientY})`); // [DEBUG/]
        if (that.options.preventDefault) { event.preventDefault(); }
        if (that.options.stopPropagation) { event.stopPropagation(); }
      }
      traceLog.push('</startListener>'); // [DEBUG/]
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
    AnimEvent.add = listener => listener; // Disable AnimEvent [DEBUG/]
    const wrappedHandler = AnimEvent.add(event => {
      traceLog.push('<moveListener>', `type:${event.type}`); // [DEBUG/]
      traceLog.push(`curPointerClass:${that.curPointerClass}`); // [DEBUG/]
      const pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch',
        pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];

      // Avoid mouse events emulation
      if (pointerClass === 'touch') { that.lastTouchTime = Date.now(); }

      if (pointerClass === that.curPointerClass) {
        that.move(pointerXY);
        if (that.options.preventDefault) { event.preventDefault(); }
        if (that.options.stopPropagation) { event.stopPropagation(); }
      }
      traceLog.push('</moveListener>'); // [DEBUG/]
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
    traceLog.push('<move>'); // [DEBUG/]
    if (!pointerXY) { traceLog.push('NO-pointerXY'); } // [DEBUG/]
    if (pointerXY) {
      this.lastPointerXY.clientX = pointerXY.clientX;
      this.lastPointerXY.clientY = pointerXY.clientY;
      traceLog.push(`lastPointerXY:(${this.lastPointerXY.clientX},${this.lastPointerXY.clientY})`); // [DEBUG/]
    }
    if (this.curMoveHandler) {
      this.curMoveHandler(this.lastPointerXY);
    }
    traceLog.push('</move>'); // [DEBUG/]
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} endHandler - This is called with pointerXY when it ends.
   * @returns {void}
   */
  addEndHandler(element, endHandler) {
    const that = this;
    function wrappedHandler(event) {
      traceLog.push('<endListener>', `type:${event.type}`); // [DEBUG/]
      traceLog.push(`curPointerClass:${that.curPointerClass}`); // [DEBUG/]
      const pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch',
        pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];

      // Avoid mouse events emulation
      if (pointerClass === 'touch') { that.lastTouchTime = Date.now(); }

      if (pointerClass === that.curPointerClass) {
        if (!pointerXY) { console.log(`No pointerXY in event "${event.type}".`); } // [DEBUG/]
        that.end(pointerXY);
        if (that.options.preventDefault) { event.preventDefault(); }
        if (that.options.stopPropagation) { event.stopPropagation(); }
      }
      traceLog.push('</endListener>'); // [DEBUG/]
    }
    addEventListenerWithOptions(element, 'mouseup', wrappedHandler, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchend', wrappedHandler, {capture: false, passive: false});
    that.curEndHandler = endHandler;
  }

  /**
   * @param {{clientX, clientY}} [pointerXY] - This might be MouseEvent, Touch of TouchEvent or Object.
   * @returns {void}
   */
  end(pointerXY) {
    traceLog.push('<end>'); // [DEBUG/]
    if (!pointerXY) { traceLog.push('NO-pointerXY'); } // [DEBUG/]
    if (pointerXY) {
      this.lastPointerXY.clientX = pointerXY.clientX;
      this.lastPointerXY.clientY = pointerXY.clientY;
      traceLog.push(`lastPointerXY:(${this.lastPointerXY.clientX},${this.lastPointerXY.clientY})`); // [DEBUG/]
    }
    if (this.curEndHandler) {
      this.curEndHandler(this.lastPointerXY);
    }
    this.curPointerClass = null;
    traceLog.push(`curPointerClass:${this.curPointerClass}`); // [DEBUG/]
    traceLog.push('</end>'); // [DEBUG/]
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} cancelHandler - This is called when it cancels.
   * @returns {void}
   */
  addCancelHandler(element, cancelHandler) {
    const that = this;
    function wrappedHandler(
      event // [DEBUG/]
    ) {
      traceLog.push('<cancelListener>', `type:${event.type}`); // [DEBUG/]
      traceLog.push(`curPointerClass:${that.curPointerClass}`); // [DEBUG/]
      /*
        Now, this is fired by touchcancel only, but it might be fired even if curPointerClass is mouse.
      */
      // const pointerClass = 'touch';

      // Avoid mouse events emulation
      that.lastTouchTime = Date.now();

      // if (pointerClass === that.curPointerClass) {
      that.cancel();
      // }
      traceLog.push('</cancelListener>'); // [DEBUG/]
    }
    addEventListenerWithOptions(element, 'touchcancel', wrappedHandler, {capture: false, passive: false});
    that.curCancelHandler = cancelHandler;
  }

  /**
   * @returns {void}
   */
  cancel() {
    traceLog.push('<cancel>'); // [DEBUG/]
    if (this.curCancelHandler) {
      this.curCancelHandler();
    }
    this.curPointerClass = null;
    traceLog.push(`curPointerClass:${this.curPointerClass}`); // [DEBUG/]
    traceLog.push('</cancel>'); // [DEBUG/]
  }

  static get addEventListenerWithOptions() { return addEventListenerWithOptions; }
}

// [DEBUG]
PointerEvent.traceLog = traceLog;
// [/DEBUG]

export default PointerEvent;
