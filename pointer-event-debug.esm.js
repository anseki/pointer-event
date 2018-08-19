/* ================================================
        DON'T MANUALLY EDIT THIS FILE
================================================ */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * PointerEvent
 * https://github.com/anseki/pointer-event
 *
 * Copyright (c) 2018 anseki
 * Licensed under the MIT license.
 */

import AnimEvent from 'anim-event';

var MOUSE_EMU_INTERVAL = 400; // Avoid mouse events emulation

// [DEBUG]
var traceLog = [];
// [/DEBUG]

// Support options for addEventListener
var passiveSupported = false;
try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveSupported = true;
    }
  }));
} catch (error) {} /* ignore */

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
  for (var i = 0; i < touches.length; i++) {
    if (touches[i].identifier === id) {
      return touches[i];
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
function dragstart(event) {
  event.preventDefault();
}

var PointerEvent = function () {
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
    this.lastPointerXY = { clientX: 0, clientY: 0 };
    this.lastTouchTime = 0;

    // Options
    this.options = { // Default
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
    key: 'regStartHandler',
    value: function regStartHandler(startHandler) {
      var that = this;
      that.startHandlers[++that.lastHandlerId] = function (event) {
        traceLog.push('<startListener>', 'type:' + event.type); // [DEBUG/]
        traceLog.push('curPointerClass:' + that.curPointerClass + (that.curPointerClass === 'touch' ? '(#' + that.curTouchId + ')' : '')); // [DEBUG/]
        var pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
            now = Date.now();
        var pointerXY = void 0,
            touchId = void 0;

        if (pointerClass === 'touch') {
          that.lastTouchTime = now; // Avoid mouse events emulation
          pointerXY = event.changedTouches[0];
          touchId = event.changedTouches[0].identifier;
        } else {
          // Avoid mouse events emulation
          if (now - that.lastTouchTime < MOUSE_EMU_INTERVAL) {
            console.warn('Event "' + event.type + '" was ignored.'); // [DEBUG/]
            traceLog.push('CANCEL', '</startListener>'); // [DEBUG/]
            return;
          }
          pointerXY = event;
        }
        if (!hasXY(pointerXY)) {
          throw new Error('No clientX/clientY');
        }

        // It is new one even if those are 'mouse' or ID is same, then cancel current one.
        if (that.curPointerClass) {
          that.cancel();
        }

        if (startHandler.call(that, pointerXY)) {
          that.curPointerClass = pointerClass;
          that.curTouchId = pointerClass === 'touch' ? touchId : null;
          traceLog.push('curPointerClass:' + that.curPointerClass + (that.curPointerClass === 'touch' ? '(#' + that.curTouchId + ')' : '')); // [DEBUG/]
          that.lastPointerXY.clientX = pointerXY.clientX;
          that.lastPointerXY.clientY = pointerXY.clientY;
          traceLog.push('lastPointerXY:(' + that.lastPointerXY.clientX + ',' + that.lastPointerXY.clientY + ')'); // [DEBUG/]
          if (that.options.preventDefault) {
            event.preventDefault();
          }
          if (that.options.stopPropagation) {
            event.stopPropagation();
          }
        }
        traceLog.push('</startListener>'); // [DEBUG/]
      };
      return that.lastHandlerId;
    }

    /**
     * @param {number} handlerId - An ID which was returned by regStartHandler.
     * @returns {void}
     */

  }, {
    key: 'unregStartHandler',
    value: function unregStartHandler(handlerId) {
      delete this.startHandlers[handlerId];
    }

    /**
     * @param {Element} element - A target element.
     * @param {number} handlerId - An ID which was returned by regStartHandler.
     * @returns {number} handlerId which was passed.
     */

  }, {
    key: 'addStartHandler',
    value: function addStartHandler(element, handlerId) {
      if (!this.startHandlers[handlerId]) {
        throw new Error('Invalid handlerId: ' + handlerId);
      }
      addEventListenerWithOptions(element, 'mousedown', this.startHandlers[handlerId], { capture: false, passive: false });
      addEventListenerWithOptions(element, 'touchstart', this.startHandlers[handlerId], { capture: false, passive: false });
      addEventListenerWithOptions(element, 'dragstart', dragstart, { capture: false, passive: false });
      return handlerId;
    }

    /**
     * @param {Element} element - A target element.
     * @param {number} handlerId - An ID which was returned by regStartHandler.
     * @returns {number} handlerId which was passed.
     */

  }, {
    key: 'removeStartHandler',
    value: function removeStartHandler(element, handlerId) {
      if (!this.startHandlers[handlerId]) {
        throw new Error('Invalid handlerId: ' + handlerId);
      }
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

  }, {
    key: 'addMoveHandler',
    value: function addMoveHandler(element, moveHandler) {
      var that = this;
      AnimEvent.add = function (listener) {
        return listener;
      }; // Disable AnimEvent [DEBUG/]
      var wrappedHandler = AnimEvent.add(function (event) {
        traceLog.push('<moveListener>', 'type:' + event.type); // [DEBUG/]
        traceLog.push('curPointerClass:' + that.curPointerClass + (that.curPointerClass === 'touch' ? '(#' + that.curTouchId + ')' : '')); // [DEBUG/]
        var pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch';

        // Avoid mouse events emulation
        if (pointerClass === 'touch') {
          that.lastTouchTime = Date.now();
        }

        if (pointerClass === that.curPointerClass) {
          var pointerXY = pointerClass === 'touch' ? getTouchById(event.changedTouches, that.curTouchId) : event;
          if (pointerClass === 'touch' && !pointerXY) {
            traceLog.push('NOT-FOUND-TOUCH(#' + that.curTouchId + ')');
          } // [DEBUG/]
          if (hasXY(pointerXY)) {
            if (pointerXY.clientX !== that.lastPointerXY.clientX || pointerXY.clientY !== that.lastPointerXY.clientY) {
              that.move(pointerXY);
            } else {
              // [DEBUG/]
              traceLog.push('NOT-CHANGED'); // [DEBUG/]
            }
            if (that.options.preventDefault) {
              event.preventDefault();
            }
            if (that.options.stopPropagation) {
              event.stopPropagation();
            }
          }
        }
        traceLog.push('</moveListener>'); // [DEBUG/]
      });
      addEventListenerWithOptions(element, 'mousemove', wrappedHandler, { capture: false, passive: false });
      addEventListenerWithOptions(element, 'touchmove', wrappedHandler, { capture: false, passive: false });
      that.curMoveHandler = moveHandler;
    }

    /**
     * @param {{clientX, clientY}} [pointerXY] - This might be MouseEvent, Touch of TouchEvent or Object.
     * @returns {void}
     */

  }, {
    key: 'move',
    value: function move(pointerXY) {
      traceLog.push('<move>'); // [DEBUG/]
      if (hasXY(pointerXY)) {
        this.lastPointerXY.clientX = pointerXY.clientX;
        this.lastPointerXY.clientY = pointerXY.clientY;
        traceLog.push('lastPointerXY:(' + this.lastPointerXY.clientX + ',' + this.lastPointerXY.clientY + ')'); // [DEBUG/]
      } else {
        // [DEBUG/]
        traceLog.push('NO-pointerXY'); // [DEBUG/]
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

  }, {
    key: 'addEndHandler',
    value: function addEndHandler(element, endHandler) {
      var that = this;
      function wrappedHandler(event) {
        traceLog.push('<endListener>', 'type:' + event.type); // [DEBUG/]
        traceLog.push('curPointerClass:' + that.curPointerClass + (that.curPointerClass === 'touch' ? '(#' + that.curTouchId + ')' : '')); // [DEBUG/]
        var pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch';

        // Avoid mouse events emulation
        if (pointerClass === 'touch') {
          that.lastTouchTime = Date.now();
        }

        if (pointerClass === that.curPointerClass) {
          var pointerXY = pointerClass === 'touch' ? getTouchById(event.changedTouches, that.curTouchId) || (
          // It might have been removed from `touches` even if it is not in `changedTouches`.
          getTouchById(event.touches, that.curTouchId) ? null : {}) : // `{}` means matching
          event;
          if (pointerClass === 'touch' && (!pointerXY || pointerXY.identifier == null)) {
            traceLog.push('CHECKED:event.touches');
          } // [DEBUG/]
          if (pointerClass === 'touch' && !pointerXY) {
            traceLog.push('NOT-FOUND-TOUCH(#' + that.curTouchId + ')');
          } // [DEBUG/]
          if (pointerXY) {
            if (!hasXY(pointerXY)) {
              console.log('No pointerXY in event "' + event.type + '".');
            } // [DEBUG/]
            that.end(pointerXY);
            if (that.options.preventDefault) {
              event.preventDefault();
            }
            if (that.options.stopPropagation) {
              event.stopPropagation();
            }
          }
        }
        traceLog.push('</endListener>'); // [DEBUG/]
      }
      addEventListenerWithOptions(element, 'mouseup', wrappedHandler, { capture: false, passive: false });
      addEventListenerWithOptions(element, 'touchend', wrappedHandler, { capture: false, passive: false });
      that.curEndHandler = endHandler;
    }

    /**
     * @param {{clientX, clientY}} [pointerXY] - This might be MouseEvent, Touch of TouchEvent or Object.
     * @returns {void}
     */

  }, {
    key: 'end',
    value: function end(pointerXY) {
      traceLog.push('<end>'); // [DEBUG/]
      if (hasXY(pointerXY)) {
        this.lastPointerXY.clientX = pointerXY.clientX;
        this.lastPointerXY.clientY = pointerXY.clientY;
        traceLog.push('lastPointerXY:(' + this.lastPointerXY.clientX + ',' + this.lastPointerXY.clientY + ')'); // [DEBUG/]
      } else {
        // [DEBUG/]
        traceLog.push('NO-pointerXY'); // [DEBUG/]
      }
      if (this.curEndHandler) {
        this.curEndHandler(this.lastPointerXY);
      }
      this.curPointerClass = this.curTouchId = null;
      traceLog.push('curPointerClass:' + this.curPointerClass); // [DEBUG/]
      traceLog.push('</end>'); // [DEBUG/]
    }

    /**
     * @param {Element} element - A target element.
     * @param {function} cancelHandler - This is called when it cancels.
     * @returns {void}
     */

  }, {
    key: 'addCancelHandler',
    value: function addCancelHandler(element, cancelHandler) {
      var that = this;
      function wrappedHandler(event) {
        traceLog.push('<cancelListener>', 'type:' + event.type); // [DEBUG/]
        traceLog.push('curPointerClass:' + that.curPointerClass + (that.curPointerClass === 'touch' ? '(#' + that.curTouchId + ')' : '')); // [DEBUG/]
        /*
          Now, this is fired by touchcancel only, but it might be fired even if curPointerClass is mouse.
        */
        // const pointerClass = 'touch';

        that.lastTouchTime = Date.now(); // Avoid mouse events emulation

        if (that.curPointerClass != null) {
          var pointerXY = getTouchById(event.changedTouches, that.curTouchId) || (
          // It might have been removed from `touches` even if it is not in `changedTouches`.
          getTouchById(event.touches, that.curTouchId) ? null : {}); // `{}` means matching
          if (!pointerXY || pointerXY.identifier == null) {
            traceLog.push('CHECKED:event.touches');
          } // [DEBUG/]
          if (!pointerXY) {
            traceLog.push('NOT-FOUND-TOUCH(#' + that.curTouchId + ')');
          } // [DEBUG/]
          if (pointerXY) {
            that.cancel();
          }
        }
        traceLog.push('</cancelListener>'); // [DEBUG/]
      }
      addEventListenerWithOptions(element, 'touchcancel', wrappedHandler, { capture: false, passive: false });
      that.curCancelHandler = cancelHandler;
    }

    /**
     * @returns {void}
     */

  }, {
    key: 'cancel',
    value: function cancel() {
      traceLog.push('<cancel>'); // [DEBUG/]
      if (this.curCancelHandler) {
        this.curCancelHandler();
      }
      this.curPointerClass = this.curTouchId = null;
      traceLog.push('curPointerClass:' + this.curPointerClass); // [DEBUG/]
      traceLog.push('</cancel>'); // [DEBUG/]
    }
  }], [{
    key: 'addEventListenerWithOptions',
    get: function get() {
      return addEventListenerWithOptions;
    }
  }]);

  return PointerEvent;
}();

// [DEBUG]


PointerEvent.traceLog = traceLog;
// [/DEBUG]

export default PointerEvent;