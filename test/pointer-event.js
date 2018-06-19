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
/*
 * PointerEvent
 * https://github.com/anseki/pointer-event
 *
 * Copyright (c) 2018 anseki
 * Licensed under the MIT license.
 */



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
        console.log('Event "' + event.type + '" was ignored.'); // [DEBUG/]
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
    var pointerMove = anim_event__WEBPACK_IMPORTED_MODULE_0__["default"].add(function (event) {
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

/* harmony default export */ __webpack_exports__["default"] = (PointerEvent);

/***/ })

/******/ })["default"];
//# sourceMappingURL=pointer-event.js.map