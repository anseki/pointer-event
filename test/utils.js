/* exported utils */
/* eslint-env browser */
/* eslint no-var: off, prefer-arrow-callback: off, object-shorthand: off */

var utils = (function() {
  'use strict';

  var identifier = 0;

  function fireMouseEvent(target, type, pointerXY) {
    target.dispatchEvent(new MouseEvent(type, pointerXY));
  }

  function fireTouchEvent(target, type, pointerXY) {
    pointerXY.identifier = identifier++;
    pointerXY.target = target;
    target.dispatchEvent(new TouchEvent(type, {targetTouches: [new Touch(pointerXY)]}));
  }

  function logPointerXY(pointerXY) {
    return 'pointerXY:' + (
      pointerXY ? ('(' + pointerXY.clientX + ',' + pointerXY.clientY + ')') : 'NONE');
  }

  return {
    fireMouseEvent: fireMouseEvent,
    fireTouchEvent: fireTouchEvent,
    logPointerXY: logPointerXY
  };
})();
