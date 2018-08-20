/* exported utils */
/* eslint-env browser */
/* eslint no-var: off, prefer-arrow-callback: off, object-shorthand: off */

var utils = (function() {
  'use strict';

  var DEFAULT_INTERVAL = 10;

  function intervalExec(list) {
    var interval = 1, // default value for first
      index = -1;

    function execNext() {
      var fnc;
      while (++index <= list.length - 1) {
        if (typeof list[index] === 'number') {
          interval = list[index];
        } else if (typeof list[index] === 'function') {
          fnc = list[index];
          break;
        }
      }
      if (fnc) {
        setTimeout(function() {
          fnc();
          interval = DEFAULT_INTERVAL;
          execNext();
        }, interval);
      }
    }

    execNext();
  }

  function fireMouseEvent(target, type, pointerXY) {
    target.dispatchEvent(new MouseEvent(type, pointerXY));
  }

  function fireTouchEvent(target, type, pointerXY) { // pointerXY or touchEventInit{changedTouches}
    if (pointerXY.changedTouches) {
      pointerXY.bubbles = true;
      target.dispatchEvent(new TouchEvent(type, pointerXY));
    } else { // Auto init
      pointerXY.identifier = 0;
      pointerXY.target = target;
      var touch = new Touch(pointerXY);
      target.dispatchEvent(new TouchEvent(type, {
        changedTouches: [touch],
        touches: type === 'touchstart' || type === 'touchmove' ? [touch] : []
      }));
    }
  }

  function logPointerXY(pointerXY) {
    return 'pointerXY:' + (
      pointerXY ? ('(' + pointerXY.clientX + ',' + pointerXY.clientY + ')') : 'NONE');
  }

  return {
    intervalExec: intervalExec,
    fireMouseEvent: fireMouseEvent,
    fireTouchEvent: fireTouchEvent,
    logPointerXY: logPointerXY
  };
})();
