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

/** @type {{clientX, clientY}} */
var lastPointerXY = { clientX: 0, clientY: 0 },
    startHandlers = {},
    curMoveHandlers = [],
    DUPLICATE_INTERVAL = 400; // For avoiding mouse event that fired by touch interface

var handlerId = 0,
    lastStartTime = 0,
    curPointerClass = void 0;

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

var PointerEvent = {
  /**
   * @param {function} startHandler - This is called with pointerXY when it starts. This returns boolean.
   * @returns {number} handlerId which is used for adding/removing to element.
   */
  regStartHandler: function regStartHandler(startHandler) {
    startHandlers[++handlerId] = function (event) {
      var pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
          pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0],
          now = Date.now();
      if (curPointerClass && pointerClass !== curPointerClass && now - lastStartTime < DUPLICATE_INTERVAL) {
        return;
      }
      if (startHandler(pointerXY)) {
        curPointerClass = pointerClass;
        lastPointerXY.clientX = pointerXY.clientX;
        lastPointerXY.clientY = pointerXY.clientY;
        lastStartTime = now;
        event.preventDefault();
      }
    };
    return handlerId;
  },

  unregStartHandler: function unregStartHandler(handlerId) {
    delete startHandlers[handlerId];
  },

  /**
   * @param {Element} element - A target element.
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {void}
   */
  addStartHandler: function addStartHandler(element, handlerId) {
    addEventListenerWithOptions(element, 'mousedown', startHandlers[handlerId], { capture: false, passive: false });
    addEventListenerWithOptions(element, 'touchstart', startHandlers[handlerId], { capture: false, passive: false });
    addEventListenerWithOptions(element, 'dragstart', dragstart, { capture: false, passive: false });
  },

  /**
   * @param {Element} element - A target element.
   * @param {number} handlerId - An ID which was returned by regStartHandler.
   * @returns {void}
   */
  removeStartHandler: function removeStartHandler(element, handlerId) {
    element.removeEventListener('mousedown', startHandlers[handlerId], false);
    element.removeEventListener('touchstart', startHandlers[handlerId], false);
    element.removeEventListener('dragstart', dragstart, false);
  },

  /**
   * @param {Element} element - A target element.
   * @param {function} moveHandler - This is called with pointerXY when it moves.
   * @returns {void}
   */
  addMoveHandler: function addMoveHandler(element, moveHandler) {
    var pointerMove = AnimEvent.add(function (event) {
      var pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch',
          pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];
      if (pointerClass === curPointerClass) {
        moveHandler(pointerXY);
        lastPointerXY.clientX = pointerXY.clientX;
        lastPointerXY.clientY = pointerXY.clientY;
        event.preventDefault();
      }
    });
    addEventListenerWithOptions(element, 'mousemove', pointerMove, { capture: false, passive: false });
    addEventListenerWithOptions(element, 'touchmove', pointerMove, { capture: false, passive: false });
    curMoveHandlers.push(moveHandler);
  },

  /**
   * @param {Element} element - A target element.
   * @param {function} endHandler - This is called when it ends.
   * @returns {void}
   */
  addEndHandler: function addEndHandler(element, endHandler) {
    function pointerEnd(event) {
      var pointerClass = event.type === 'mouseup' ? 'mouse' : 'touch';
      if (pointerClass === curPointerClass) {
        endHandler();
        curPointerClass = null;
        event.preventDefault();
      }
    }
    addEventListenerWithOptions(element, 'mouseup', pointerEnd, { capture: false, passive: false });
    addEventListenerWithOptions(element, 'touchend', pointerEnd, { capture: false, passive: false });
    addEventListenerWithOptions(element, 'touchcancel', pointerEnd, { capture: false, passive: false });
  },

  callMoveHandler: function callMoveHandler() {
    curMoveHandlers.forEach(function (handler) {
      handler(lastPointerXY);
    });
  }
};

export default PointerEvent;