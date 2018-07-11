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

var DUPLICATE_INTERVAL = 400; // For avoiding mouse event that fired by touch interface

// Support options for addEventListener
var passiveSupported = false;
try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveSupported = true;
    }
  }));
} catch (error) {/* ignore */}

function addEventListenerWithOptions(target, type, handler, options) {
  // When `passive` is not supported, consider that the `useCapture` is supported instead of
  // `options` (i.e. options other than the `passive` also are not supported).
  target.addEventListener(type, handler, passiveSupported ? options : options.capture);
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
    this.lastPointerXY = { clientX: 0, clientY: 0 };
    this.lastStartTime = 0;

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
        var pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
            pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0],
            now = Date.now();
        if (that.curPointerClass && pointerClass !== that.curPointerClass && now - that.lastStartTime < DUPLICATE_INTERVAL) {
          console.log('Event "' + event.type + '" was ignored.'); // [DEBUG/]
          return;
        }
        if (startHandler(pointerXY)) {
          that.curPointerClass = pointerClass;
          that.lastPointerXY.clientX = pointerXY.clientX;
          that.lastPointerXY.clientY = pointerXY.clientY;
          that.lastStartTime = now;
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
      var wrappedHandler = AnimEvent.add(function (event) {
        var pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch',
            pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];
        if (pointerClass === that.curPointerClass) {
          that.move(pointerXY);
          that.lastPointerXY.clientX = pointerXY.clientX;
          that.lastPointerXY.clientY = pointerXY.clientY;
          if (that.options.preventDefault) {
            event.preventDefault();
          }
          if (that.options.stopPropagation) {
            event.stopPropagation();
          }
        }
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
      if (this.curMoveHandler) {
        if (!pointerXY) {
          pointerXY = this.lastPointerXY;
        }
        this.curMoveHandler(pointerXY);
      }
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
        var pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch',
            pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];
        if (pointerClass === that.curPointerClass) {
          if (!pointerXY) {
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
      if (this.curEndHandler) {
        if (!pointerXY) {
          pointerXY = this.lastPointerXY;
        }
        this.curEndHandler(pointerXY);
      }
      this.curPointerClass = null;
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
      function wrappedHandler() {
        /*
          Now, this is fired by touchcancel only, but it might be fired even if curPointerClass is mouse.
        */
        // const pointerClass = 'touch';
        // if (pointerClass === that.curPointerClass) {
        that.cancel();
        // }
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
      if (this.curCancelHandler) {
        this.curCancelHandler();
      }
      this.curPointerClass = null;
    }
  }]);

  return PointerEvent;
}();

export default PointerEvent;