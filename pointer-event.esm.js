/* ================================================
        DON'T MANUALLY EDIT THIS FILE
================================================ */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 * PointerEvent
 * https://github.com/anseki/pointer-event
 *
 * Copyright (c) 2022 anseki
 * Licensed under the MIT license.
 */
import AnimEvent from 'anim-event';
var MOUSE_EMU_INTERVAL = 400,
    // Avoid mouse events emulation
CLICK_EMULATOR_ELEMENTS = [],
    DBLCLICK_EMULATOR_ELEMENTS = []; // Support options for addEventListener

var passiveSupported = false;

try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveSupported = true;
    }
  }));
} catch (error) {
  /* ignore */
}
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

function getPointsLength(p0, p1) {
  var lx = p0.x - p1.x,
      ly = p0.y - p1.y;
  return Math.sqrt(lx * lx + ly * ly);
}
/**
 * Get Touch instance in list.
 * @param {Touch[]} touches - An Array or TouchList instance.
 * @param {number} id - Touch#identifier
 * @returns {(Touch|null)} - A found Touch instance.
 */


function getTouchById(touches, id) {
  if (touches != null && id != null) {
    for (var i = 0; i < touches.length; i++) {
      if (touches[i].identifier === id) {
        return touches[i];
      }
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
} // Gecko, Trident pick drag-event of some elements such as img, a, etc.


function dragstart(event) {
  event.preventDefault();
}

var PointerEvent = /*#__PURE__*/function () {
  /**
   * Create a `PointerEvent` instance.
   * @param {Object} [options] - Options
   */
  function PointerEvent(options) {
    var _this = this;

    _classCallCheck(this, PointerEvent);

    this.startHandlers = {};
    this.lastHandlerId = 0;
    this.curPointerClass = null;
    this.curTouchId = null;
    this.lastPointerXY = {
      clientX: 0,
      clientY: 0
    };
    this.lastTouchTime = 0; // Options

    this.options = {
      // Default
      preventDefault: true,
      stopPropagation: true
    };

    if (options) {
      ['preventDefault', 'stopPropagation'].forEach(function (option) {
        if (typeof options[option] === 'boolean') {
          _this.options[option] = options[option];
        }
      });
    }
  }
  /**
   * @param {function} startHandler - This is called with pointerXY when it starts. This returns boolean.
   * @returns {number} handlerId which is used for adding/removing to element.
   */


  _createClass(PointerEvent, [{
    key: "regStartHandler",
    value: function regStartHandler(startHandler) {
      var that = this;

      that.startHandlers[++that.lastHandlerId] = function (event) {
        var pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
            now = Date.now();
        var pointerXY, touchId;

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

        if (!hasXY(pointerXY)) {
          throw new Error('No clientX/clientY');
        } // It is new one even if those are 'mouse' or ID is same, then cancel current one.


        if (that.curPointerClass) {
          that.cancel();
        }

        if (startHandler.call(that, pointerXY)) {
          that.curPointerClass = pointerClass;
          that.curTouchId = pointerClass === 'touch' ? touchId : null;
          that.lastPointerXY.clientX = pointerXY.clientX;
          that.lastPointerXY.clientY = pointerXY.clientY;

          if (that.options.preventDefault) {
            event.preventDefault();
          }

          if (that.options.stopPropagation) {
            event.stopPropagation();
          }
        }
      };

      return that.lastHandlerId;
    }
    /**
     * @param {number} handlerId - An ID which was returned by regStartHandler.
     * @returns {void}
     */

  }, {
    key: "unregStartHandler",
    value: function unregStartHandler(handlerId) {
      delete this.startHandlers[handlerId];
    }
    /**
     * @param {Element} element - A target element.
     * @param {number} handlerId - An ID which was returned by regStartHandler.
     * @returns {number} handlerId which was passed.
     */

  }, {
    key: "addStartHandler",
    value: function addStartHandler(element, handlerId) {
      if (!this.startHandlers[handlerId]) {
        throw new Error("Invalid handlerId: ".concat(handlerId));
      }

      addEventListenerWithOptions(element, 'mousedown', this.startHandlers[handlerId], {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, 'touchstart', this.startHandlers[handlerId], {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, 'dragstart', dragstart, {
        capture: false,
        passive: false
      });
      return handlerId;
    }
    /**
     * @param {Element} element - A target element.
     * @param {number} handlerId - An ID which was returned by regStartHandler.
     * @returns {number} handlerId which was passed.
     */

  }, {
    key: "removeStartHandler",
    value: function removeStartHandler(element, handlerId) {
      if (!this.startHandlers[handlerId]) {
        throw new Error("Invalid handlerId: ".concat(handlerId));
      }

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

  }, {
    key: "addMoveHandler",
    value: function addMoveHandler(element, moveHandler, rawEvent) {
      var that = this;

      function handler(event) {
        var pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch'; // Avoid mouse events emulation

        if (pointerClass === 'touch') {
          that.lastTouchTime = Date.now();
        }

        if (pointerClass === that.curPointerClass) {
          var pointerXY = pointerClass === 'touch' ? getTouchById(event.changedTouches, that.curTouchId) : event;

          if (hasXY(pointerXY)) {
            if (pointerXY.clientX !== that.lastPointerXY.clientX || pointerXY.clientY !== that.lastPointerXY.clientY) {
              that.move(pointerXY);
            }

            if (that.options.preventDefault) {
              event.preventDefault();
            }

            if (that.options.stopPropagation) {
              event.stopPropagation();
            }
          }
        }
      }

      var wrappedHandler = rawEvent ? handler : AnimEvent.add(handler);
      addEventListenerWithOptions(element, 'mousemove', wrappedHandler, {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, 'touchmove', wrappedHandler, {
        capture: false,
        passive: false
      });
      that.curMoveHandler = moveHandler;
    }
    /**
     * @param {{clientX, clientY}} [pointerXY] - This might be MouseEvent, Touch of TouchEvent or Object.
     * @returns {void}
     */

  }, {
    key: "move",
    value: function move(pointerXY) {
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

  }, {
    key: "addEndHandler",
    value: function addEndHandler(element, endHandler) {
      var that = this;

      function wrappedHandler(event) {
        var pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch'; // Avoid mouse events emulation

        if (pointerClass === 'touch') {
          that.lastTouchTime = Date.now();
        }

        if (pointerClass === that.curPointerClass) {
          var pointerXY = pointerClass === 'touch' ? getTouchById(event.changedTouches, that.curTouchId) || ( // It might have been removed from `touches` even if it is not in `changedTouches`.
          getTouchById(event.touches, that.curTouchId) ? null : {}) : // `{}` means matching
          event;

          if (pointerXY) {
            that.end(pointerXY);

            if (that.options.preventDefault) {
              event.preventDefault();
            }

            if (that.options.stopPropagation) {
              event.stopPropagation();
            }
          }
        }
      }

      addEventListenerWithOptions(element, 'mouseup', wrappedHandler, {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, 'touchend', wrappedHandler, {
        capture: false,
        passive: false
      });
      that.curEndHandler = endHandler;
    }
    /**
     * @param {{clientX, clientY}} [pointerXY] - This might be MouseEvent, Touch of TouchEvent or Object.
     * @returns {void}
     */

  }, {
    key: "end",
    value: function end(pointerXY) {
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

  }, {
    key: "addCancelHandler",
    value: function addCancelHandler(element, cancelHandler) {
      var that = this;

      function wrappedHandler(event) {
        /*
          Now, this is fired by touchcancel only, but it might be fired even if curPointerClass is mouse.
        */
        // const pointerClass = 'touch';
        that.lastTouchTime = Date.now(); // Avoid mouse events emulation

        if (that.curPointerClass != null) {
          var pointerXY = getTouchById(event.changedTouches, that.curTouchId) || ( // It might have been removed from `touches` even if it is not in `changedTouches`.
          getTouchById(event.touches, that.curTouchId) ? null : {}); // `{}` means matching

          if (pointerXY) {
            that.cancel();
          }
        }
      }

      addEventListenerWithOptions(element, 'touchcancel', wrappedHandler, {
        capture: false,
        passive: false
      });
      that.curCancelHandler = cancelHandler;
    }
    /**
     * @returns {void}
     */

  }, {
    key: "cancel",
    value: function cancel() {
      if (this.curCancelHandler) {
        this.curCancelHandler();
      }

      this.curPointerClass = this.curTouchId = null;
    }
  }], [{
    key: "addEventListenerWithOptions",
    get: function get() {
      return addEventListenerWithOptions;
    }
    /**
     * Emulate `click` event via `touchend` event.
     * @param {Element} element - Target element, listeners that call `event.preventDefault()` are attached later.
     * @param {?number} moveTolerance - Move tolerance.
     * @param {?number} timeTolerance - Time tolerance.
     * @returns {Element} The passed `element`.
     */

  }, {
    key: "initClickEmulator",
    value: function initClickEmulator(element, moveTolerance, timeTolerance) {
      if (CLICK_EMULATOR_ELEMENTS.includes(element)) {
        return element;
      }

      CLICK_EMULATOR_ELEMENTS.push(element);
      var DEFAULT_MOVE_TOLERANCE = 16,
          // px
      DEFAULT_TIME_TOLERANCE = 400; // ms

      var startX, startY, touchId, startMs;

      if (moveTolerance == null) {
        moveTolerance = DEFAULT_MOVE_TOLERANCE;
      }

      if (timeTolerance == null) {
        timeTolerance = DEFAULT_TIME_TOLERANCE;
      }

      addEventListenerWithOptions(element, 'touchstart', function (event) {
        var touch = event.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        touchId = touch.identifier;
        startMs = performance.now();
      }, {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, 'touchend', function (event) {
        var touch = getTouchById(event.changedTouches, touchId);

        if (typeof startX === 'number' && typeof startY === 'number' && typeof startMs === 'number' && touch && typeof touch.clientX === 'number' && typeof touch.clientY === 'number' && getPointsLength({
          x: startX,
          y: startY
        }, {
          x: touch.clientX,
          y: touch.clientY
        }) <= moveTolerance && performance.now() - startMs <= timeTolerance) {
          // FIRE
          setTimeout(function () {
            var newEvent = new MouseEvent('click', {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            newEvent.emulated = true;
            element.dispatchEvent(newEvent);
          }, 0);
        }

        startX = startY = touchId = startMs = null;
      }, {
        capture: false,
        passive: false
      });
      addEventListenerWithOptions(element, 'touchcancel', function () {
        startX = startY = touchId = startMs = null;
      }, {
        capture: false,
        passive: false
      });
      return element;
    }
    /**
     * Emulate `dblclick` event via `touchend` event.
     * @param {Element} element - Target element, listeners that call `event.preventDefault()` are attached later.
     * @param {?number} moveTolerance - Move tolerance.
     * @param {?number} timeTolerance - Time tolerance.
     * @returns {Element} The passed `element`.
     */

  }, {
    key: "initDblClickEmulator",
    value: function initDblClickEmulator(element, moveTolerance, timeTolerance) {
      if (DBLCLICK_EMULATOR_ELEMENTS.includes(element)) {
        return element;
      }

      DBLCLICK_EMULATOR_ELEMENTS.push(element);
      var DEFAULT_MOVE_TOLERANCE = 16,
          // px
      DEFAULT_TIME_TOLERANCE = 400; // ms

      var startX, startY, startMs;

      if (moveTolerance == null) {
        moveTolerance = DEFAULT_MOVE_TOLERANCE;
      }

      if (timeTolerance == null) {
        timeTolerance = DEFAULT_TIME_TOLERANCE;
      }

      PointerEvent.initClickEmulator(element, moveTolerance, timeTolerance);
      addEventListenerWithOptions(element, 'click', function (event) {
        if (!event.emulated || // Ignore events that are not from `touchend`.
        typeof event.clientX !== 'number' || typeof event.clientY !== 'number') {
          return;
        }

        if (typeof startX === 'number' && getPointsLength({
          x: startX,
          y: startY
        }, {
          x: event.clientX,
          y: event.clientY
        }) <= moveTolerance && performance.now() - startMs <= timeTolerance * 2) {
          // up (tolerance) down (tolerance) up
          setTimeout(function () {
            // FIRE
            var newEvent = new MouseEvent('dblclick', {
              clientX: event.clientX,
              clientY: event.clientY
            });
            newEvent.emulated = true;
            element.dispatchEvent(newEvent);
          }, 0);
          startX = startY = startMs = null;
        } else {
          // 1st
          startX = event.clientX;
          startY = event.clientY;
          startMs = performance.now();
        }
      }, {
        capture: false,
        passive: false
      });
      return element;
    }
  }]);

  return PointerEvent;
}();

export default PointerEvent;