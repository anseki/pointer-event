/* ================================================
        DON'T MANUALLY EDIT THIS FILE
================================================ */

/*
 * PointerEvent
 * https://github.com/anseki/pointer-event
 *
 * Copyright (c) 2022 anseki
 * Licensed under the MIT license.
 */

import AnimEvent from 'anim-event';

const MOUSE_EMU_INTERVAL = 400; // Avoid mouse events emulation


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

/**
 * Get Touch instance in list.
 * @param {Touch[]} touches - An Array or TouchList instance.
 * @param {number} id - Touch#identifier
 * @returns {(Touch|null)} - A found Touch instance.
 */
function getTouchById(touches, id) {
  if (touches != null && id != null) {
    for (let i = 0; i < touches.length; i++) {
      if (touches[i].identifier === id) { return touches[i]; }
    }
  }
  return null;
}

/**
 * @param {Object} xy - Something that might have clientX and clientY.
 * @returns {boolean} - `true` if it has valid clientX and clientY.
 */
function hasXY(xy) {
  return xy && typeof xy.clientX === 'number' && typeof xy.clientY === 'number';
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
    this.curTouchId = null;
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
      const pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
        now = Date.now();
      let pointerXY, touchId;

      if (pointerClass === 'touch') {
        that.lastTouchTime = now; // Avoid mouse events emulation
        pointerXY = event.changedTouches[0];
        touchId = event.changedTouches[0].identifier;
      } else {
        // Avoid mouse events emulation
        if (now - that.lastTouchTime < MOUSE_EMU_INTERVAL) {
          return;
        }
        pointerXY = event;
      }
      if (!hasXY(pointerXY)) { throw new Error('No clientX/clientY'); }

      // It is new one even if those are 'mouse' or ID is same, then cancel current one.
      if (that.curPointerClass) { that.cancel(); }

      if (startHandler.call(that, pointerXY)) {
        that.curPointerClass = pointerClass;
        that.curTouchId = pointerClass === 'touch' ? touchId : null;
        that.lastPointerXY.clientX = pointerXY.clientX;
        that.lastPointerXY.clientY = pointerXY.clientY;
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
   * @param {?boolean} rawEvent - Capture events without `requestAnimationFrame`.
   * @returns {void}
   */
  addMoveHandler(element, moveHandler, rawEvent) {
    const that = this;

    function handler(event) {
      const pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch';

      // Avoid mouse events emulation
      if (pointerClass === 'touch') { that.lastTouchTime = Date.now(); }

      if (pointerClass === that.curPointerClass) {
        const pointerXY = pointerClass === 'touch'
          ? getTouchById(event.changedTouches, that.curTouchId) : event;
        if (hasXY(pointerXY)) {
          if (pointerXY.clientX !== that.lastPointerXY.clientX ||
              pointerXY.clientY !== that.lastPointerXY.clientY) {
            that.move(pointerXY);
          }
          if (that.options.preventDefault) { event.preventDefault(); }
          if (that.options.stopPropagation) { event.stopPropagation(); }
        }
      }
    }

    const wrappedHandler = rawEvent ? handler : AnimEvent.add(handler);
    addEventListenerWithOptions(element, 'mousemove', wrappedHandler, {capture: false, passive: false});
    addEventListenerWithOptions(element, 'touchmove', wrappedHandler, {capture: false, passive: false});
    that.curMoveHandler = moveHandler;
  }

  /**
   * @param {{clientX, clientY}} [pointerXY] - This might be MouseEvent, Touch of TouchEvent or Object.
   * @returns {void}
   */
  move(pointerXY) {
    if (hasXY(pointerXY)) {
      this.lastPointerXY.clientX = pointerXY.clientX;
      this.lastPointerXY.clientY = pointerXY.clientY;
    }
    if (this.curMoveHandler) {
      this.curMoveHandler(this.lastPointerXY);
    }
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} endHandler - This is called with pointerXY when it ends.
   * @returns {void}
   */
  addEndHandler(element, endHandler) {
    const that = this;
    function wrappedHandler(event) {
      const pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch';

      // Avoid mouse events emulation
      if (pointerClass === 'touch') { that.lastTouchTime = Date.now(); }

      if (pointerClass === that.curPointerClass) {
        const pointerXY = pointerClass === 'touch'
          ? getTouchById(event.changedTouches, that.curTouchId) ||
            // It might have been removed from `touches` even if it is not in `changedTouches`.
            (getTouchById(event.touches, that.curTouchId) ? null : {}) : // `{}` means matching
          event;
        if (pointerXY) {
          that.end(pointerXY);
          if (that.options.preventDefault) { event.preventDefault(); }
          if (that.options.stopPropagation) { event.stopPropagation(); }
        }
      }
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
    if (hasXY(pointerXY)) {
      this.lastPointerXY.clientX = pointerXY.clientX;
      this.lastPointerXY.clientY = pointerXY.clientY;
    }
    if (this.curEndHandler) {
      this.curEndHandler(this.lastPointerXY);
    }
    this.curPointerClass = this.curTouchId = null;
  }

  /**
   * @param {Element} element - A target element.
   * @param {function} cancelHandler - This is called when it cancels.
   * @returns {void}
   */
  addCancelHandler(element, cancelHandler) {
    const that = this;
    function wrappedHandler(event) {
      /*
        Now, this is fired by touchcancel only, but it might be fired even if curPointerClass is mouse.
      */
      // const pointerClass = 'touch';

      that.lastTouchTime = Date.now(); // Avoid mouse events emulation

      if (that.curPointerClass != null) {
        const pointerXY = getTouchById(event.changedTouches, that.curTouchId) ||
          // It might have been removed from `touches` even if it is not in `changedTouches`.
          (getTouchById(event.touches, that.curTouchId) ? null : {}); // `{}` means matching
        if (pointerXY) {
          that.cancel();
        }
      }
    }
    addEventListenerWithOptions(element, 'touchcancel', wrappedHandler, {capture: false, passive: false});
    that.curCancelHandler = cancelHandler;
  }

  /**
   * @returns {void}
   */
  cancel() {
    if (this.curCancelHandler) {
      this.curCancelHandler();
    }
    this.curPointerClass = this.curTouchId = null;
  }

  static get addEventListenerWithOptions() { return addEventListenerWithOptions; }

  /**
   * Emulate `click` event via `touchend` event.
   * @param {Element} element - Target element, listeners that call `event.preventDefault()` are attached later.
   * @param {?number} moveTolerance - Move tolerance.
   * @param {?number} timeTolerance - Time tolerance.
   * @returns {Element} The passed `element`.
   */
  static initClickEmulator(element, moveTolerance, timeTolerance) {
    const DEFAULT_MOVE_TOLERANCE = 16, // px
      DEFAULT_TIME_TOLERANCE = 400; // ms
    let startX, startY, touchId, startMs;

    if (moveTolerance == null) { moveTolerance = DEFAULT_MOVE_TOLERANCE; }
    if (timeTolerance == null) { timeTolerance = DEFAULT_TIME_TOLERANCE; }

    /**
     * Get Touch instance in list.
     * @param {Touch[]} touches - An Array or TouchList instance.
     * @param {number} id - Touch#identifier
     * @returns {(Touch|null)} - A found Touch instance.
     */
    function getTouchById(touches, id) {
      if (touches != null && id != null) {
        for (let i = 0; i < touches.length; i++) {
          if (touches[i].identifier === id) { return touches[i]; }
        }
      }
      return null;
    }

    function getPointsLength(p0, p1) {
      const lx = p0.x - p1.x,
        ly = p0.y - p1.y;
      return Math.sqrt(lx * lx + ly * ly);
    }

    element.addEventListener('touchstart', event => {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      touchId = touch.identifier;
      startMs = performance.now();
    });

    element.addEventListener('touchend', event => {
      const touch = getTouchById(event.changedTouches, touchId);
      if (typeof startX === 'number' && typeof startY === 'number' && typeof startMs === 'number' &&
          touch && typeof touch.clientX === 'number' && typeof touch.clientY === 'number' &&
          getPointsLength(
            {x: startX, y: startY}, {x: touch.clientX, y: touch.clientY}) <= moveTolerance &&
          performance.now() - startMs <= timeTolerance) {
        // FIRE
        setTimeout(() => {
          element.dispatchEvent(
            new MouseEvent('click', {clientX: touch.clientX, clientY: touch.clientY}));
        }, 0);
      }
      startX = startY = touchId = startMs = null;
    });

    element.addEventListener('touchcancel', () => { startX = startY = touchId = startMs = null; });

    return element;
  }
}


export default PointerEvent;
