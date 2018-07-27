var PointerEvent =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/pointer-event.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/anim-event/anim-event.esm.js":
/*!***************************************************!*\
  !*** ./node_modules/anim-event/anim-event.esm.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* ================================================
        DON'T MANUALLY EDIT THIS FILE
================================================ */

/*
 * AnimEvent
 * https://github.com/anseki/anim-event
 *
 * Copyright (c) 2018 anseki
 * Licensed under the MIT license.
 */

var MSPF = 1000 / 60,
    // ms/frame (FPS: 60)
KEEP_LOOP = 500,


/**
 * @typedef {Object} task
 * @property {Event} event
 * @property {function} listener
 */

/** @type {task[]} */
tasks = [];

var requestAnim = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  return setTimeout(callback, MSPF);
},
    cancelAnim = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function (requestID) {
  return clearTimeout(requestID);
};

var lastFrameTime = Date.now(),
    requestID = void 0;

function step() {
  var called = void 0,
      next = void 0;

  if (requestID) {
    cancelAnim.call(window, requestID);
    requestID = null;
  }

  tasks.forEach(function (task) {
    var event = void 0;
    if (event = task.event) {
      task.event = null; // Clear it before `task.listener()` because that might fire another event.
      task.listener(event);
      called = true;
    }
  });

  if (called) {
    lastFrameTime = Date.now();
    next = true;
  } else if (Date.now() - lastFrameTime < KEEP_LOOP) {
    // Go on for a while
    next = true;
  }
  if (next) {
    requestID = requestAnim.call(window, step);
  }
}

function indexOfTasks(listener) {
  var index = -1;
  tasks.some(function (task, i) {
    if (task.listener === listener) {
      index = i;
      return true;
    }
    return false;
  });
  return index;
}

var AnimEvent = {
  /**
   * @param {function} listener - An event listener.
   * @returns {(function|null)} A wrapped event listener.
   */
  add: function add(listener) {
    var task = void 0;
    if (indexOfTasks(listener) === -1) {
      tasks.push(task = { listener: listener });
      return function (event) {
        task.event = event;
        if (!requestID) {
          step();
        }
      };
    }
    return null;
  },
  remove: function remove(listener) {
    var iRemove = void 0;
    if ((iRemove = indexOfTasks(listener)) > -1) {
      tasks.splice(iRemove, 1);
      if (!tasks.length && requestID) {
        cancelAnim.call(window, requestID);
        requestID = null;
      }
    }
  }
};

/* harmony default export */ __webpack_exports__["default"] = (AnimEvent);

/***/ }),

/***/ "./src/pointer-event.js":
/*!******************************!*\
  !*** ./src/pointer-event.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var anim_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! anim-event */ "./node_modules/anim-event/anim-event.esm.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * PointerEvent
 * https://github.com/anseki/pointer-event
 *
 * Copyright (c) 2018 anseki
 * Licensed under the MIT license.
 */



var DUPLICATE_INTERVAL = 400; // For avoiding mouse event that fired by touch interface

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
        traceLog.push('<startListener>', 'type:' + event.type); // [DEBUG/]
        traceLog.push('curPointerClass:' + that.curPointerClass); // [DEBUG/]
        var pointerClass = event.type === 'mousedown' ? 'mouse' : 'touch',
            pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0],
            now = Date.now();
        if (that.curPointerClass && pointerClass !== that.curPointerClass && now - that.lastStartTime < DUPLICATE_INTERVAL) {
          console.log('Event "' + event.type + '" was ignored.'); // [DEBUG/]
          traceLog.push('CANCEL', '</startListener>'); // [DEBUG/]
          return;
        }
        if (startHandler.call(that, pointerXY)) {
          that.curPointerClass = pointerClass;
          traceLog.push('curPointerClass:' + that.curPointerClass); // [DEBUG/]
          that.lastPointerXY.clientX = pointerXY.clientX;
          that.lastPointerXY.clientY = pointerXY.clientY;
          traceLog.push('lastPointerXY:(' + that.lastPointerXY.clientX + ',' + that.lastPointerXY.clientY + ')'); // [DEBUG/]
          that.lastStartTime = now;
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
      anim_event__WEBPACK_IMPORTED_MODULE_0__["default"].add = function (listener) {
        return listener;
      }; // Disable AnimEvent [DEBUG/]
      var wrappedHandler = anim_event__WEBPACK_IMPORTED_MODULE_0__["default"].add(function (event) {
        traceLog.push('<moveListener>', 'type:' + event.type); // [DEBUG/]
        traceLog.push('curPointerClass:' + that.curPointerClass); // [DEBUG/]
        var pointerClass = event.type === 'mousemove' ? 'mouse' : 'touch',
            pointerXY = pointerClass === 'mouse' ? event : event.targetTouches[0] || event.touches[0];
        if (pointerClass === that.curPointerClass) {
          that.move(pointerXY);
          if (that.options.preventDefault) {
            event.preventDefault();
          }
          if (that.options.stopPropagation) {
            event.stopPropagation();
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
      if (!pointerXY) {
        traceLog.push('NO-pointerXY');
      } // [DEBUG/]
      if (pointerXY) {
        this.lastPointerXY.clientX = pointerXY.clientX;
        this.lastPointerXY.clientY = pointerXY.clientY;
        traceLog.push('lastPointerXY:(' + this.lastPointerXY.clientX + ',' + this.lastPointerXY.clientY + ')'); // [DEBUG/]
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
        traceLog.push('curPointerClass:' + that.curPointerClass); // [DEBUG/]
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
      if (!pointerXY) {
        traceLog.push('NO-pointerXY');
      } // [DEBUG/]
      if (pointerXY) {
        this.lastPointerXY.clientX = pointerXY.clientX;
        this.lastPointerXY.clientY = pointerXY.clientY;
        traceLog.push('lastPointerXY:(' + this.lastPointerXY.clientX + ',' + this.lastPointerXY.clientY + ')'); // [DEBUG/]
      }
      if (this.curEndHandler) {
        this.curEndHandler(this.lastPointerXY);
      }
      this.curPointerClass = null;
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
      function wrappedHandler(event // [DEBUG/]
      ) {
        traceLog.push('<cancelListener>', 'type:' + event.type); // [DEBUG/]
        traceLog.push('curPointerClass:' + that.curPointerClass); // [DEBUG/]
        /*
          Now, this is fired by touchcancel only, but it might be fired even if curPointerClass is mouse.
        */
        // const pointerClass = 'touch';
        // if (pointerClass === that.curPointerClass) {
        that.cancel();
        // }
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
      this.curPointerClass = null;
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

/* harmony default export */ __webpack_exports__["default"] = (PointerEvent);

/***/ })

/******/ })["default"];
//# sourceMappingURL=pointer-event.js.map