# PointerEvent

Event Controller for mouse and touch interfaces

## Usage

```js
var pointerEvent = new PointerEvent(),

  // startHandlerId which is used for adding/removing to element is returned.
  startHandlerId = pointerEvent.regStartHandler(function(pointerXY) {
    console.log('[START]');
    console.dir(pointerXY);
    return true; // If it returns `false`, the starting is canceled.
  });

// When `mousedown` or `touchstart` is fired on this element, the registered start-handler is called.
pointerEvent.addStartHandler(document.getElementById('trigger'), startHandlerId);

// When `mousemove` or `touchmove` is fired on this element, this move-handler is called.
pointerEvent.addMoveHandler(document, function(pointerXY) {
  console.log('[MOVE]');
  console.dir(pointerXY);
});

// When `mouseup` or `touchend` is fired on this element, this end-handler is called.
pointerEvent.addEndHandler(document, function(pointerXY) {
  console.log('[END]');
  console.dir(pointerXY);
});

// When `touchcancel` is fired on this element, this cancel-handler is called.
pointerEvent.addCancelHandler(document, function() {
  console.log('[CANCEL]');
});

// ============================================================================

document.getElementById('move-button').addEventListener('click', function() {
  // Emulate the `move` that is done when `mousemove` or `touchmove` is fired.
  pointerEvent.move();
}, false);

document.getElementById('end-button').addEventListener('click', function() {
  // Emulate the `end` that is done when `mouseup` or `touchend` is fired.
  pointerEvent.end();
}, false);

document.getElementById('cancel-button').addEventListener('click', function() {
  // Emulate the `cancel` that is done when `touchcancel` is fired.
  pointerEvent.cancel();
}, false);

// ============================================================================

// Remove the added start-handler from this element.
pointerEvent.removeStartHandler(document.getElementById('trigger'), startHandlerId);

// Unregister the registered start-handler.
pointerEvent.unregStartHandler(startHandlerId);

// ============================================================================

// Options:
// preventDefault {boolean} [true] - Call `event.preventDefault()` if it is `true`.
// stopPropagation {boolean} [true] - Call `event.stopPropagation()` if it is `true`.
var pointerEvent = new PointerEvent({stopPropagation: false}); // Don't call that.

// ============================================================================

// addEventListener with specific option.
PointerEvent.addEventListenerWithOptions(target, type, handler, options);
```
