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

// When `mouseup`, `touchend` or `touchcancel` is fired on this element, this end-handler is called.
pointerEvent.addEndHandler(document, function() {
  console.log('[END]');
});

// ============================================================================

document.getElementById('move-button').addEventListener('click', function() {
  // Emulate the `move` that is done when `mousemove` or `touchmove` is fired.
  pointerEvent.move();
}, false);

document.getElementById('end-button').addEventListener('click', function() {
  // Emulate the `end` that is done when `mouseup`, `touchend` or `touchcancel` is fired.
  pointerEvent.end();
}, false);

// ============================================================================

// Remove the added start-handler from this element.
pointerEvent.removeStartHandler(document.getElementById('trigger'), startHandlerId);

// Unregister the registered start-handler.
pointerEvent.unregStartHandler(startHandlerId);

// ============================================================================

// Options:
// preventDefault {boolean} [true] - Call `event.preventDefault()` if it is `true`.
// stopImmediatePropagation {boolean} [true] - Call `event.stopImmediatePropagation()` if it is `true`.
var pointerEvent = new PointerEvent({stopImmediatePropagation: false}); // Don't call that.
```
